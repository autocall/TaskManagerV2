using System.Net;
using System.Text;
using TaskManager.Common.Extensions;
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
}