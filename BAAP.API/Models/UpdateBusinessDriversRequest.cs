using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BAAP.API.Models;

public class UpdateBusinessDriversRequest
{
    [Required]
    public List<BusinessDriverDto> BusinessDrivers { get; set; } = new();
}

public class BusinessDriverDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    [Required]
    public string Priority { get; set; } = "Medium";
    public int Impact { get; set; }
    public int Urgency { get; set; }
    public int BusinessValue { get; set; }
}
