$cert = New-SelfSignedCertificate -DnsName "localhost" -CertStoreLocation "cert:\LocalMachine\My" -NotAfter (Get-Date).AddYears(1) -KeySpec Signature -KeyUsage DigitalSignature -KeyAlgorithm RSA -KeyLength 2048

$rootStore = "cert:\LocalMachine\Root"
$store = Get-Item $rootStore
$store.Open("ReadWrite")
$store.Add($cert)
$store.Close()

Write-Host "Certificate created and trusted for localhost"
Write-Host "Thumbprint: $($cert.Thumbprint)"
