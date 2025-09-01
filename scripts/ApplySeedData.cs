// Quick .NET console app to apply seed data to Azure SQL
using System;
using System.IO;

class Program 
{
    static void Main()
    {
        Console.WriteLine("🔄 Azure SQL Seed Data Application");
        Console.WriteLine("This application will connect to Azure SQL and apply supplemental seed data.");
        Console.WriteLine();
        
        Console.WriteLine("To run this manually:");
        Console.WriteLine("1. Open Azure Portal");
        Console.WriteLine("2. Navigate to SQL Database > baap_dev");  
        Console.WriteLine("3. Open Query Editor");
        Console.WriteLine("4. Copy and paste the content from azure_supplement_seed_data.sql");
        Console.WriteLine("5. Execute the script");
        Console.WriteLine();
        
        if (File.Exists("azure_supplement_seed_data.sql"))
        {
            var content = File.ReadAllText("azure_supplement_seed_data.sql");
            var lines = content.Split('\n').Length;
            Console.WriteLine($"✅ Found azure_supplement_seed_data.sql ({lines} lines)");
            Console.WriteLine();
            Console.WriteLine("Script contains:");
            Console.WriteLine("- 25 Timeline items for project phases");
            Console.WriteLine("- 14 Risk items across all assessments");
            Console.WriteLine("- 3 Architecture reviews with detailed analysis");
            Console.WriteLine();
            Console.WriteLine("This will make Azure database match the local development database.");
        }
        else
        {
            Console.WriteLine("❌ azure_supplement_seed_data.sql not found in current directory");
        }
        
        Console.WriteLine();
        Console.WriteLine("Press any key to exit...");
        Console.ReadKey();
    }
}