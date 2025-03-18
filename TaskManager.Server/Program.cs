using TaskManager.Common;
using TaskManager.Data;
using TaskManager.Data.Context;
using TaskManager.Data.Entities;
using TaskManager.Data.Identity;
using TaskManager.Logic;
using TaskManager.Logic.Mapping;
using TaskManager.Server.Infrastructure;
using TaskManager.Server.Logger;
using TaskManager.Server.Mapping;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManager.Logic.Services;
using Microsoft.Extensions.FileProviders;
using System.Diagnostics;
using LinqToDB.Data;
using LinqToDB.AspNet;
using LinqToDB;

namespace TaskManager.Server;
public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);

        var services = builder.Services;

        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        //Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
        //Console.WriteLine($"Connection string: {connectionString}");

        services.AddDbContext<TmDbContext>(options =>
            options.UseSqlServer(connectionString, options => options.CommandTimeout((int)TimeSpan.FromSeconds(30).TotalSeconds)));

        services.AddLinqToDBContext<LinqToDbContext>((provider, options) =>
            options.UseSqlServer(connectionString)
        );

        services.AddIdentity<TmUser, TmRole>()
            .AddEntityFrameworkStores<TmDbContext>()
            .AddDefaultTokenProviders();

        services.Configure<IdentityOptions>(options => {
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 6;
            options.SignIn.RequireConfirmedEmail = false;
        });

        services.AddSession(options => {
            options.Cookie.Name = "TaskManager.Session";
            options.IdleTimeout = TimeSpan.FromHours(48);
            options.Cookie.HttpOnly = false;
            options.Cookie.IsEssential = true;
        });

        services.AddAuthentication(options => {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Settings.PrivateKey)),
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });
        services.AddAuthorization();

        services
            .AddControllers()
            .AddNewtonsoftJson();

        services
            .AddControllersWithViews()
            .AddNewtonsoftJson();

        services.AddCors();

        services.AddExceptionHandler<ExceptionHandler>();

        var mappingConfig = new MapperConfiguration(conf => {
            conf.AddProfile(new LogicMappingProfile());
            conf.AddProfile(new ViewMappingProfile());
            conf.AllowNullCollections = true;
        });

        services.AddLogging(config => {
#if TEST
            // for output to github console
            config.ClearProviders();
#endif
            config.AddConfiguration(builder.Configuration.GetSection("Logging"));
            config.AddEventSourceLogger();
        });

        services.AddSingleton(mappingConfig.CreateMapper());
        services.AddScoped<ICommonLogger, CommonLogger>();
        services.AddScoped<UnitOfWork>();
        services.AddScoped<ServicesHost>();

        services.AddTransient<IUserStore<TmUser>, TmUserStore>();
        services.AddTransient<IRoleStore<TmRole>, TmRoleStore>();
        services.AddTransient<UserManager<TmUser>>();
        services.AddTransient<RoleManager<TmRole>>();
        services.AddTransient<SignInManager<TmUser>>();
        services.AddTransient<AuthService>();

        Log4NetExtensions.AddLog4Net(builder.Logging);

        var app = builder.Build();

        app.UseDefaultFiles();
        var resourcePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "build");
        if (!Directory.Exists(resourcePath)) {
            Directory.CreateDirectory(resourcePath);
        }
        app.UseStaticFiles(new StaticFileOptions {
            FileProvider = new PhysicalFileProvider(resourcePath),
        });
        // for SPA
        app.MapFallbackToFile("build/index.html");
        app.UseCors();

        if (builder.Environment.IsDevelopment()) {
            app.UseDeveloperExceptionPage();
            //app.UseExceptionHandler(exceptionHandlerApp => {
            //    exceptionHandlerApp.Run(async context => {
            //        _l.e("ExceptionHandler", context.Features.Get<IExceptionHandlerFeature>().Error);
            //    });
            //});
        } else {
            app.UseHttpsRedirection();
        }
        app.UseExceptionHandler(options => { });
        app.UseMiddleware<ErrorFromHeaderMiddleware>();

        app.UseAuthorization();

        app.MapControllers();

        try {
            using (var scope = app.Services.CreateScope()) {
                var serviceProvider = scope.ServiceProvider;
                ServiceLocator.Initialize(serviceProvider);
                var host = serviceProvider.GetRequiredService<ServicesHost>();
                using (var dbContext = serviceProvider.GetRequiredService<TmDbContext>()) {
                    _l.Init(serviceProvider.GetRequiredService<ICommonLogger>());
                    if (dbContext.Database.GetPendingMigrations().Any()) {
                        _l.i("Migrating database");
                        dbContext.Database.Migrate();
                    }
                    _l.i("Seeding database");
                    using (var linqToDbContext = serviceProvider.GetRequiredService<LinqToDbContext>()) {
                        TmDbContextSeed.SeedAsync(linqToDbContext, host.UserManager, host.RoleManager).Wait();
                    }
                }
            }
            app.Run();
        } catch (Exception e) {
            _l.e(e.ToString());
            throw;
        }
    }
}