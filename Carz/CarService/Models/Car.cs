using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarService.Models
{
    public class Car
    {
        public int id { get; set; }
        public string manufacturer { get; set; }
        public string make { get; set; }
        public string model { get; set; }
        public int year { get; set; }
    }
}
