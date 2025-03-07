using System.Net;
using System.Text;
using TaskManager.Common.Extensions;
using TaskManager.Logic.Dtos;
using TaskManager.Server.Models;
using TaskManager.Test.Models;
using Xunit.Abstractions;

namespace TaskManager.Test;

public class Project_UnitTest {
    private readonly ITestOutputHelper Output;
    public Project_UnitTest(ITestOutputHelper output) {
        Output = output;
    }

    private async Task<string> SignInAsync() {
        var cookieContainer = new CookieContainer();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                CookieContainer = cookieContainer,
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
        Assert.True(response.IsSuccessStatusCode);
        var model = JsonExtension.Deserialize<LoginModel>(data);
        return model.Token;
    }

    [Fact]
    public async Task Test01_GetAll() {
        var token = await SignInAsync();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            }
        );
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

        var response = await httpClient.GetAsync($"{Settings.Site}/Api/Project/GetAll");
        var data = await response.Content.ReadAsStringAsync();

        Output.WriteLine($"StatusCode: {response.StatusCode}");
        Output.WriteLine($"Response: {data}");
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task Test02_Get_Create_Update_Delete() {
        var token = await SignInAsync();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
            }
        );
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

        ProjectDto dto;
        {
            var response = await httpClient.GetAsync($"{Settings.Site}/Api/Project/GetAll");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Get Projects ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            var dtos = JsonExtension.Deserialize<List<ProjectDto>>(data);
            dto = dtos.FirstOrDefault(e => e.Name.StartsWith("Test "));
        }

        if (dto != null) {
            var response = await httpClient.DeleteAsync($"{Settings.Site}/Api/Project/Delete/{dto.Id}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Delete Project ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(1, JsonExtension.Deserialize<int>(data));
        }
        
        { 
            var response = await httpClient.PostAsync($"{Settings.Site}/Api/Project/Create",
                new StringContent(
                    JsonExtension.Serialize(new CreateProjectViewModel() {
                        Name = "Test Project",
                    }),
                    Encoding.UTF8, "application/json")
            );
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Create Project ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            dto = JsonExtension.Deserialize<ProjectDto>(data);
        }

        {
            var response = await httpClient.PutAsync($"{Settings.Site}/Api/Project/Update",
                new StringContent(
                    JsonExtension.Serialize(new UpdateProjectViewModel() {
                        Id = dto.Id,
                        Name = "Test Project Updated",
                    }),
                    Encoding.UTF8, "application/json")
            );
            var data = await response.Content.ReadAsStringAsync();
            dto = JsonExtension.Deserialize<ProjectDto>(data);
            Assert.Equal("Test Project Updated", dto.Name);

            Output.WriteLine($"--- Update Project ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
        }

        {
            var response = await httpClient.DeleteAsync($"{Settings.Site}/Api/Project/Delete/{dto.Id}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Delete Project ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(1, JsonExtension.Deserialize<int>(data));
        }
    }
}