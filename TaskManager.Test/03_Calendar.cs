using System.Net;
using System.Text;
using TaskManager.Common.Extensions;
using TaskManager.Logic.Dtos;
using TaskManager.Logic.Enums;
using TaskManager.Server.Models;
using TaskManager.Test.Models;
using Xunit.Abstractions;

namespace TaskManager.Test;

public class Calendar_UnitTest {
    private readonly ITestOutputHelper Output;
    public Calendar_UnitTest(ITestOutputHelper output) {
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
    public async Task Test01_GetCurrent() {
        var token = await SignInAsync();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true
            }
        );
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

        var response = await httpClient.GetAsync($"{Settings.Site}/Api/Calendar/GetCurrent");
        var data = await response.Content.ReadAsStringAsync();

        Output.WriteLine($"StatusCode: {response.StatusCode}");
        Output.WriteLine($"Response: {data}");
        Assert.True(response.IsSuccessStatusCode);
    }

    [Fact]
    public async Task Test02_Get_Create_Update_Complete_Delete() {
        var token = await SignInAsync();
        var httpClient = new HttpClient(
            new HttpClientHandler() {
                ServerCertificateCustomValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true,
            }
        );
        httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

        EventDto dto;
        {
            var response = await httpClient.GetAsync($"{Settings.Site}/Api/Event/GetAll");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Get Events ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            var dtos = JsonExtension.Deserialize<List<EventDto>>(data);
            dto = dtos.FirstOrDefault(e => e.Name.StartsWith("Test "));
        }

        if (dto != null) {
            var response = await httpClient.DeleteAsync($"{Settings.Site}/Api/Event/Delete/{dto.Id}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Delete Event ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(1, JsonExtension.Deserialize<int>(data));
        }

        {
            var response = await httpClient.PostAsync($"{Settings.Site}/Api/Event/Create",
                new StringContent(
                    JsonExtension.Serialize(new {
                        Date = DateOnly.FromDateTime(DateTime.Now),
                        Name = "Test Event",
                    }),
                    Encoding.UTF8, "application/json")
            );
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Create Event ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);

            dto = JsonExtension.Deserialize<EventDto>(data);
        }

        {
            var response = await httpClient.PutAsync($"{Settings.Site}/Api/Event/Update",
                new StringContent(
                    JsonExtension.Serialize(new UpdateEventViewModel() {
                        Id = dto.Id,
                        Date = DateOnly.FromDateTime(DateTime.Now),
                        Name = "Test Event Updated",
                        Type = EventTypeEnum.Task,
                        RepeatType = EventRepeatEnum.Days,
                        RepeatValue = 5,
                    }),
                    Encoding.UTF8, "application/json")
            );
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Update Event ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
        }

        {
            var response = await httpClient.PutAsync($"{Settings.Site}/Api/Event/Complete",
                new StringContent(
                    JsonExtension.Serialize(new CompleteEventViewModel() {
                        Id = dto.Id,
                    }),
                    Encoding.UTF8, "application/json")
            );
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Complete Event ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
        }

        {
            var response = await httpClient.DeleteAsync($"{Settings.Site}/Api/Event/Delete/{dto.Id}");
            var data = await response.Content.ReadAsStringAsync();

            Output.WriteLine($"--- Delete Event ---");
            Output.WriteLine($"StatusCode: {response.StatusCode}");
            Output.WriteLine($"Response: {data}");
            Assert.True(response.IsSuccessStatusCode);
            Assert.Equal(1, JsonExtension.Deserialize<int>(data));
        }
    }
}