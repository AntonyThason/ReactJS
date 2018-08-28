using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CarService.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace CarService.Controllers
{
    [Route("api/[controller]")]
    public class CarController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public CarController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET api/car
        [HttpGet]
        public IEnumerable<Car> Get()
        {
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            Car[] carlist = null;

            using (StreamReader r = new StreamReader(contentRootPath + @"/Data/carlist.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                carlist = (Car[])serializer.Deserialize(r, typeof(Car[]));
            }

            return carlist;
        }

        // POST api/car
        [HttpPost]
        public bool Post([FromBody]Car car)
        {
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            List<Car> carlist = null;

            using (StreamReader r = new StreamReader(contentRootPath + @"/Data/carlist.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                carlist = (List<Car>)serializer.Deserialize(r, typeof(List<Car>));
            }

            if (car.id == -1)
            {
                car.id = carlist.Max(c => c.id) + 1;
                carlist.Add(car);
            }
            else
            {
                var item = carlist.FirstOrDefault(c => c.id == car.id);
                if (item != null)
                {
                    item.manufacturer = car.manufacturer;
                    item.make = car.make;
                    item.model = car.model;
                    item.year = car.year;
                }
            }

            string output = JsonConvert.SerializeObject(carlist, Formatting.Indented);
            System.IO.File.WriteAllText(contentRootPath + @"/Data/carlist.json", output);

            return true;

        }

        // DELETE api/car/5
        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            string contentRootPath = _hostingEnvironment.ContentRootPath;

            List<Car> carlist = null;

            using (StreamReader r = new StreamReader(contentRootPath + @"/Data/carlist.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                carlist = (List<Car>)serializer.Deserialize(r, typeof(List<Car>));
            }

            var item = carlist.FirstOrDefault(c => c.id == id);
            if (item != null)
            {
                carlist.Remove(item);
            }

            string output = JsonConvert.SerializeObject(carlist, Formatting.Indented);
            System.IO.File.WriteAllText(contentRootPath + @"/Data/carlist.json", output);

            return true;
        }
    }
}