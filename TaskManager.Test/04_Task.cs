using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Web;
using TaskManager.Common.Extensions;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;
using TaskManager.Server.Models;
using TaskManager.Test.Models;
using Xunit.Abstractions;

namespace TaskManager.Test;

public class Task_UnitTest {
    private readonly ITestOutputHelper Output;
    public Task_UnitTest(ITestOutputHelper output) {
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

        var response = await httpClient.GetAsync($"{Settings.Site}/Api/Task/GetAll");
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

        CategoryDto categoryDto;
        {
            var response = await httpClient.GetAsync($"{Settings.Site}/Api/Category/GetAll");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Get Categories ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            var dtos = JsonExtension.Deserialize<List<CategoryDto>>(data);
            categoryDto = dtos.First();
        }

        TaskDto dto;
        {
            var response = await httpClient.GetAsync($"{Settings.Site}/Api/Task/GetAll");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Get Tasks ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            var dtos = JsonExtension.Deserialize<List<TaskDto>>(data);
            dto = dtos.FirstOrDefault(e => e.Title.StartsWith("Test "));
        }

        if (dto != null) {
            var response = await httpClient.DeleteAsync($"{Settings.Site}/Api/Task/Delete/{dto.Id}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Delete Task ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(1, JsonExtension.Deserialize<int>(data));
        }

        var fileName = "test.txt";
        var fileData = "123";
        {
            var fileContent = new ByteArrayContent(Encoding.UTF8.GetBytes(fileData));
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("text/plain");

            var response = await httpClient.PostAsync($"{Settings.Site}/Api/Task/Create", new MultipartFormDataContent {
                {
                    new StringContent(JsonExtension.Serialize(new CreateTaskViewModel() {
                        Title = "Test Task",
                        CategoryId = categoryDto.Id,
                        Column = TaskColumnEnum.First,
                        Status = TaskStatusEnum.New,
                    }), Encoding.UTF8, "application/json"),
                    "modelJson"
                },
                {
                    fileContent,
                    "files",
                    fileName
                }
            });
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Create Task ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            dto = JsonExtension.Deserialize<TaskDto>(data);
        }

        {
            var response = await httpClient.GetAsync($"{Settings.Site}/Api/File/{dto.CompanyId}/{dto.Id}/{HttpUtility.UrlEncode(fileName)}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Read File ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(fileData, data);
        }

        {
            var response = await httpClient.PutAsync($"{Settings.Site}/Api/Task/Update", new MultipartFormDataContent {
                {
                    new StringContent(
                        JsonExtension.Serialize(new UpdateTaskViewModel() {
                            Id = dto.Id,
                            Title = "Test Task Updated",
                            CategoryId = categoryDto.Id,
                            Column = TaskColumnEnum.First,
                            Status = TaskStatusEnum.New,
                            DeleteFileNames = new List<string> { fileName }
                        }), Encoding.UTF8, "application/json"),
                    "modelJson"
                }
            });
            var data = await response.Content.ReadAsStringAsync();
            dto = JsonExtension.Deserialize<TaskDto>(data);

            Output.WriteLine($"--- Update Task ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.Equal("Test Task Updated", dto.Title);
            Assert.True(response.IsSuccessStatusCode);
        }

        {
            var response = await httpClient.GetAsync($"{Settings.Site}/Api/File/{dto.CompanyId}/{dto.Id}/{HttpUtility.UrlEncode(fileName)}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Not Found File ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        {
            var response = await httpClient.DeleteAsync($"{Settings.Site}/Api/Task/Delete/{dto.Id}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Delete Task ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(1, JsonExtension.Deserialize<int>(data));
        }
    }
}