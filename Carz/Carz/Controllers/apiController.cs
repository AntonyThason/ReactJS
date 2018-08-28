using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Carz.Controllers
{
    [Route("[controller]")]
    public class apiController : Controller
    {
        private string apiUrl = "http://localhost:60001/";
        JObject jsonResult;

        [HttpGet("[action]")]
        public JObject getCarList()
        {

            var httpClient = HttpClientHelper.GetHttpClient();
            HttpResponseMessage response = httpClient.GetAsync(apiUrl + "api/car").Result;
            if (response.IsSuccessStatusCode)
            {
                string result = response.Content.ReadAsStringAsync().Result;
                jsonResult = JObject.Parse(result);
            }

            return jsonResult;

            //var model = new { roles = new[] { "Agent" }, langType = "en", txnId = "3957218135" };

            //await callAPI(model, "api/car", HttpMethod.Get);

            //return jsonResult;

            //var rng = new Random();
            //return Enumerable.Range(1, 5).Select(index => new car
            //{
            //    id=index,
            //    manufacturer="Test",
            //    make="",
            //    model="",
            //    year=2000
            //});
        }

        [HttpPost("[action]")]
        public bool saveCarDetail(car car)
        {
            return true;
        }

        [HttpPost("[action]")]
        public bool deleteCarDetail(car car)
        {
            return true;
        }

        public class car
        {
            public int id { get; set; }
            public string manufacturer { get; set; }
            public string make { get; set; }
            public string model { get; set; }
            public int year { get; set; }
        }

        private async Task callAPI(object model, string method, HttpMethod type)
        {
            var client = new HttpClient();

            var request = new HttpRequestMessage
            {
                RequestUri = new Uri(apiUrl + method),
                Method = type,
                Content = new StringContent(JsonConvert.SerializeObject(model), Encoding.UTF8, "application/json")
            };

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            using (var response = await client.SendAsync(request))
            {
                var result = response.Content.ReadAsStringAsync().Result;
                jsonResult = JObject.Parse(result);
            }
        }
    }

    public class HttpClientHelper
    {
        public static HttpClient GetHttpClient()
        {
            var MyHttpClient = new HttpClient();
            //dynamic _token = HttpContext.Current.Session["token"];
            //if (_token == null) throw new ArgumentNullException(nameof(_token));
            //MyHttpClient.DefaultRequestHeaders.Add("Authorization", String.Format("Bearer {0}", _token.AccessToken));
            return MyHttpClient;
        }
    }
}
