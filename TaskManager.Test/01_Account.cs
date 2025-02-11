using System.Net;
using System.Text;
using TaskManager.Common.Extensions;
using TaskManager.Server.Models;
using Xunit.Abstractions;

namespace TaskManager.Test;

public class Account_UnitTest {
    private readonly ITestOutputHelper Output;
    public Account_UnitTest(ITestOutputHelper output) {
        Output = output;
    }

    [Fact]
    public async Task Test01_SignUp() {
        var cookieContainer = new CookieContainer();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            }
        );

        var response = await httpClient.PostAsync($"{Settings.Site}/Api/Account/SignUp",
            new StringContent(
                JsonExtension.Serialize(new SignUpViewModel() {
                    UserName = Settings.TestUserName,
                    Email = Settings.TestUserEmail,
                    Password = Settings.DefaultPassword }),
                Encoding.UTF8, "application/json")
        );
        var data = await response.Content.ReadAsStringAsync();

        Output.WriteLine($"StatusCode: {response.StatusCode}");
        Output.WriteLine($"Response: {data}");
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task Test02_SignIn() {
        var cookieContainer = new CookieContainer();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            }
        );

        var response = await httpClient.PostAsync($"{Settings.Site}/Api/Account/SignIn",
            new StringContent(
                JsonExtension.Serialize(new LoginViewModel() {
                    Email = Settings.TestUserEmail,
                    Password = Settings.DefaultPassword
                }),
                Encoding.UTF8, "application/json")
        );
        var data = await response.Content.ReadAsStringAsync();

        Output.WriteLine($"StatusCode: {response.StatusCode}");
        Output.WriteLine($"Response: {data}");
        Assert.True(response.IsSuccessStatusCode);
    }
}
