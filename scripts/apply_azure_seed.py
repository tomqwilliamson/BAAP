#!/usr/bin/env python3
"""
Python script to apply supplemental seed data to Azure SQL Database
Uses Azure CLI authentication tokens
"""

import subprocess
import json
import requests
import sys

def get_azure_token():
    """Get Azure access token using Azure CLI"""
    try:
        result = subprocess.run(['az', 'account', 'get-access-token', '--resource', 'https://database.windows.net/'], 
                              capture_output=True, text=True, check=True)
        token_info = json.loads(result.stdout)
        return token_info['accessToken']
    except Exception as e:
        print(f"Failed to get Azure token: {e}")
        return None

def execute_sql_query(token, query):
    """Execute SQL query using Azure REST API"""
    url = f"https://management.azure.com/subscriptions/{get_subscription_id()}/resourceGroups/rg-baap-dev/providers/Microsoft.Sql/servers/baap-dev-sql-wsnmnw/databases/baap_dev/query"
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    data = {
        'query': query
    }
    
    params = {
        'api-version': '2020-11-01-preview'
    }
    
    try:
        response = requests.post(url, headers=headers, json=data, params=params)
        return response
    except Exception as e:
        print(f"Failed to execute query: {e}")
        return None

def get_subscription_id():
    """Get current Azure subscription ID"""
    try:
        result = subprocess.run(['az', 'account', 'show', '--query', 'id', '-o', 'tsv'], 
                              capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except Exception as e:
        print(f"Failed to get subscription ID: {e}")
        return None

def main():
    print("🔄 Getting Azure authentication token...")
    token = get_azure_token()
    if not token:
        print("❌ Failed to authenticate with Azure")
        return 1

    print("🔄 Testing connection to Azure SQL Database...")
    test_query = "SELECT COUNT(*) as TimelineCount FROM ProjectTimelineItems"
    response = execute_sql_query(token, test_query)
    
    if response and response.status_code == 200:
        result = response.json()
        print(f"✅ Connected successfully. Current timeline items: {result}")
        
        print("🔄 Reading supplemental seed data...")
        try:
            with open('azure_supplement_seed_data.sql', 'r') as f:
                sql_content = f.read()
            
            # Split into individual statements and execute them
            statements = [s.strip() for s in sql_content.split(';') if s.strip() and not s.strip().upper().startswith('PRINT')]
            
            print(f"🔄 Executing {len(statements)} SQL statements...")
            
            success_count = 0
            for i, statement in enumerate(statements):
                if statement:
                    print(f"   Executing statement {i+1}/{len(statements)}...")
                    response = execute_sql_query(token, statement)
                    if response and response.status_code == 200:
                        success_count += 1
                    else:
                        print(f"   ⚠️ Statement {i+1} failed: {response.status_code if response else 'No response'}")
            
            print(f"✅ Successfully executed {success_count}/{len(statements)} statements")
            
        except FileNotFoundError:
            print("❌ azure_supplement_seed_data.sql file not found")
            return 1
        except Exception as e:
            print(f"❌ Error reading/executing SQL: {e}")
            return 1
    else:
        print(f"❌ Failed to connect to Azure SQL Database. Status: {response.status_code if response else 'No response'}")
        if response:
            print(f"Response: {response.text}")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())