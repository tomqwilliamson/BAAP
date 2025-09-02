# Create development certificates for React HTTPS
$certPath = "C:\Users\twilliamson\source\repos\BAAP\.cert"

# Create directory if it doesn't exist
if (!(Test-Path -Path $certPath)) {
    New-Item -ItemType Directory -Path $certPath -Force
}

# Create self-signed certificate
$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "Cert:\CurrentUser\My" -NotAfter (Get-Date).AddYears(2)

# Convert to PFX and CRT
$pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText
$pfxPath = Join-Path $certPath "localhost.pfx"
$crtPath = Join-Path $certPath "localhost.crt"
$keyPath = Join-Path $certPath "localhost.key"

Export-PfxCertificate -Cert $cert -FilePath $pfxPath -Password $pwd
Export-Certificate -Cert $cert -FilePath $crtPath

# Extract private key using OpenSSL (if available)
Write-Host "Certificate created at: $crtPath"
Write-Host "To trust this certificate, run: Import-Certificate -FilePath '$crtPath' -CertStoreLocation 'Cert:\CurrentUser\Root'"
Write-Host ""
Write-Host "Then update .env.development with:"
Write-Host "SSL_CRT_FILE=$crtPath"
Write-Host "SSL_KEY_FILE=$keyPath"