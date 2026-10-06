param(
  [string]$SourcePath = "source-elements.json",
  [string]$PubChemPath = "pubchem-snapshot.json",
  [string]$OutputPath = "js/elements-data.js"
)

$ErrorActionPreference = "Stop"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

function Read-Utf8Json([string]$Path) {
  $resolved = Resolve-Path $Path
  return [System.IO.File]::ReadAllText($resolved, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
}

$source = (Read-Utf8Json $SourcePath).elements | Where-Object { $_.number -le 118 }
$pubchem = Read-Utf8Json $PubChemPath

if ($source.Count -ne 118 -or $pubchem.Count -ne 118) {
  throw "Se esperaban 118 elementos en ambas fuentes."
}

$spanishNames = @(
  "Hidrógeno", "Helio", "Litio", "Berilio", "Boro", "Carbono", "Nitrógeno", "Oxígeno", "Flúor", "Neón",
  "Sodio", "Magnesio", "Aluminio", "Silicio", "Fósforo", "Azufre", "Cloro", "Argón", "Potasio", "Calcio",
  "Escandio", "Titanio", "Vanadio", "Cromo", "Manganeso", "Hierro", "Cobalto", "Níquel", "Cobre", "Zinc",
  "Galio", "Germanio", "Arsénico", "Selenio", "Bromo", "Kriptón", "Rubidio", "Estroncio", "Itrio", "Circonio",
  "Niobio", "Molibdeno", "Tecnecio", "Rutenio", "Rodio", "Paladio", "Plata", "Cadmio", "Indio", "Estaño",
  "Antimonio", "Telurio", "Yodo", "Xenón", "Cesio", "Bario", "Lantano", "Cerio", "Praseodimio", "Neodimio",
  "Prometio", "Samario", "Europio", "Gadolinio", "Terbio", "Disprosio", "Holmio", "Erbio", "Tulio", "Iterbio",
  "Lutecio", "Hafnio", "Tántalo", "Wolframio", "Renio", "Osmio", "Iridio", "Platino", "Oro", "Mercurio",
  "Talio", "Plomo", "Bismuto", "Polonio", "Astato", "Radón", "Francio", "Radio", "Actinio", "Torio",
  "Protactinio", "Uranio", "Neptunio", "Plutonio", "Americio", "Curio", "Berkelio", "Californio", "Einsteinio", "Fermio",
  "Mendelevio", "Nobelio", "Lawrencio", "Rutherfordio", "Dubnio", "Seaborgio", "Bohrio", "Hasio", "Meitnerio", "Darmstatio",
  "Roentgenio", "Copernicio", "Nihonio", "Flerovio", "Moscovio", "Livermorio", "Teneso", "Oganesón"
)

# Pesos atómicos abreviados para lectura. Entre corchetes se muestra el
# número másico de un isótopo representativo cuando no existe peso estándar.
$massLabels = @(
  "1.008", "4.0026", "6.94", "9.0122", "10.81", "12.011", "14.007", "15.999", "18.998", "20.180",
  "22.990", "24.305", "26.982", "28.085", "30.974", "32.06", "35.45", "39.948", "39.098", "40.078",
  "44.956", "47.867", "50.942", "51.996", "54.938", "55.845", "58.933", "58.693", "63.546", "65.38",
  "69.723", "72.630", "74.922", "78.971", "79.904", "83.798", "85.468", "87.62", "88.906", "91.222",
  "92.906", "95.95", "[98]", "101.07", "102.91", "106.42", "107.87", "112.41", "114.82", "118.71",
  "121.76", "127.60", "126.90", "131.29", "132.91", "137.33", "138.91", "140.12", "140.91", "144.24",
  "[145]", "150.36", "151.96", "157.249", "158.93", "162.50", "164.93", "167.26", "168.93", "173.05",
  "174.9667", "178.49", "180.95", "183.84", "186.21", "190.23", "192.22", "195.08", "196.97", "200.59",
  "204.38", "207.2", "208.98", "[209]", "[210]", "[222]", "[223]", "[226]", "[227]", "232.04",
  "231.04", "238.03", "[237]", "[244]", "[243]", "[247]", "[247]", "[251]", "[252]", "[257]",
  "[258]", "[259]", "[266]", "[267]", "[268]", "[269]", "[270]", "[269]", "[277]", "[281]",
  "[282]", "[285]", "[286]", "[290]", "[290]", "[293]", "[294]", "[294]"
)

$categoryMembers = [ordered]@{
  "alkali" = @(3, 11, 19, 37, 55, 87)
  "alkaline" = @(4, 12, 20, 38, 56, 88)
  "transition" = @(21..30) + @(39..48) + @(72..80) + @(104..112)
  "post-transition" = @(13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116)
  "metalloid" = @(5, 14, 32, 33, 51, 52)
  "nonmetal" = @(1, 6, 7, 8, 15, 16, 34)
  "halogen" = @(9, 17, 35, 53, 85, 117)
  "noble" = @(2, 10, 18, 36, 54, 86, 118)
  "lanthanide" = @(57..71)
  "actinide" = @(89..103)
}

$categoryPhrases = @{
  "alkali" = "un metal alcalino muy reactivo"
  "alkaline" = "un metal alcalinotérreo"
  "transition" = "un metal de transición"
  "post-transition" = "un metal del bloque p"
  "metalloid" = "un metaloide de propiedades intermedias"
  "nonmetal" = "un no metal"
  "halogen" = "un halógeno reactivo"
  "noble" = "un gas noble de baja reactividad"
  "lanthanide" = "un lantánido de la serie f"
  "actinide" = "un actínido radiactivo de la serie f"
}

$alternateAliases = @{
  "Zn" = @("cinc")
  "Kr" = @("criptón", "cripton")
  "Zr" = @("zirconio")
  "Nb" = @("columbio")
  "Cd" = @("cadmium")
  "I" = @("iodo")
  "Cs" = @("caesium")
  "Hf" = @("hafnium")
  "Ta" = @("tantalio", "tantalum")
  "W" = @("tungsteno", "tungsten")
  "Lr" = @("laurencio", "lawrence")
  "Hs" = @("hassio", "hassium")
  "Ds" = @("darmstadtio", "darmstadtium")
  "Rg" = @("roentgenium", "röntgenio")
  "Nh" = @("nihonium")
  "Mc" = @("moscovium")
  "Ts" = @("tennessine")
  "Og" = @("oganesson")
}

$discovererOverrides = @{
  13 = "Hans Christian Ørsted y Friedrich Wöhler"
  84 = "Marie y Pierre Curie"
  85 = "Dale R. Corson, Kenneth R. MacKenzie y Emilio Segrè"
  88 = "Marie y Pierre Curie"
  89 = "André-Louis Debierne y Friedrich Oskar Giesel (crédito histórico discutido)"
  91 = "Kasimir Fajans y Oswald Göhring; Otto Hahn y Lise Meitner"
  93 = "Edwin McMillan y Philip Abelson"
}

$gasNumbers = @(1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86)
$liquidNumbers = @(35, 80)
$elements = @()

for ($index = 0; $index -lt 118; $index++) {
  $n = $index + 1
  $s = $source[$index]
  $p = $pubchem[$index]
  $name = $spanishNames[$index]

  $category = $null
  foreach ($entry in $categoryMembers.GetEnumerator()) {
    if ($entry.Value -contains $n) { $category = $entry.Key; break }
  }
  if (-not $category) { throw "Categoría no definida para Z=$n" }

  $group = if (($n -ge 57 -and $n -le 71) -or ($n -ge 89 -and $n -le 103)) { $null } else { [int]$s.group }
  $state = if ($n -ge 104) { $null } elseif ($gasNumbers -contains $n) { "gas" } elseif ($liquidNumbers -contains $n) { "liquid" } else { "solid" }
  $stateStatus = if ($n -ge 104) { "unknown" } elseif ($n -in 85, 87) { "estimated" } else { "measured" }

  $yearText = [string]$p.yearDiscovered
  $year = if ($yearText -match '^\d+$') { [int]$yearText } else { $null }
  $discoveryLabel = if ($yearText -eq "Ancient") { "Antigüedad" } elseif (-not $year) { "No determinado" } else { $null }

  if ($discovererOverrides.ContainsKey($n)) {
    $discoverer = $discovererOverrides[$n]
  } elseif ($yearText -eq "Ancient") {
    $discoverer = "Civilizaciones antiguas"
  } else {
    $discoverer = [string]$s.discovered_by
    $discoverer = $discoverer.Replace("Ancient Egypt", "Civilizaciones del Antiguo Egipto")
    $discoverer = $discoverer.Replace("Ancient china", "China antigua")
    $discoverer = $discoverer.Replace("Middle East", "Pueblos del Oriente Próximo")
    $discoverer = $discoverer.Replace("Bronze Age", "Culturas de la Edad del Bronce")
    $discoverer = $discoverer.Replace("unknown, before", "Autoría desconocida; antes de")
    $discoverer = $discoverer.Replace("5000 BC", "aprox. 5000 a. C.")
    $discoverer = $discoverer.Replace("3000 BC", "aprox. 3000 a. C.")
    $discoverer = $discoverer.Replace("3500 BC", "aprox. 3500 a. C.")
    $discoverer = $discoverer.Replace("2000 BCE", "aprox. 2000 a. C.")
    $discoverer = $discoverer.Replace("Joint Institute for Nuclear Research", "Instituto Conjunto de Investigación Nuclear (JINR)")
    $discoverer = $discoverer.Replace("Lawrence Berkeley National Laboratory", "Laboratorio Nacional Lawrence Berkeley")
    $discoverer = $discoverer.Replace("Gesellschaft für Schwerionenforschung", "Centro GSI para la Investigación de Iones Pesados")
    if ([string]::IsNullOrWhiteSpace($discoverer)) { $discoverer = "No determinado" }
  }

  $configuration = [string]$s.electron_configuration_semantic
  if ([string]::IsNullOrWhiteSpace($configuration)) { $configuration = [string]$p.electronConfiguration }
  $configuration = $configuration.TrimStart('*').Trim()

  $aliases = @([string]$s.name)
  if ($alternateAliases.ContainsKey([string]$s.symbol)) { $aliases += $alternateAliases[[string]$s.symbol] }

  $stateInDescription = switch ($state) {
    "gas" { "gaseoso" }
    "liquid" { "líquido" }
    "solid" { "sólido" }
    default { $null }
  }

  if ($stateInDescription) {
    $description = "$name ($($s.symbol)) es el elemento químico de número atómico $n. Es $($categoryPhrases[$category]) del período $($s.period) y, en condiciones ambientales de referencia, se presenta en estado $stateInDescription."
  } else {
    $description = "$name ($($s.symbol)) es el elemento químico de número atómico $n. Se clasifica como $($categoryPhrases[$category]) del período $($s.period). Solo se han producido cantidades microscópicas, por lo que sus propiedades macroscópicas no se han medido directamente."
  }

  $elements += [ordered]@{
    atomicNumber = $n
    symbol = [string]$s.symbol
    name = $name
    aliases = $aliases
    atomicMass = $massLabels[$index]
    category = $category
    group = $group
    period = [int]$s.period
    gridColumn = [int]$s.xpos
    gridRow = [int]$s.ypos
    block = [string]$s.block
    state = $state
    stateStatus = $stateStatus
    electronConfiguration = $configuration
    configurationStatus = $(if ($n -ge 104) { "predicted" } else { "measured" })
    shells = @($s.shells | ForEach-Object { [int]$_ })
    electronegativity = $(if ($null -eq $p.electronegativity) { $null } else { [double]$p.electronegativity })
    density = $(if ($null -eq $p.density) { $null } else { [double]$p.density })
    meltingPoint = $(if ($null -eq $p.meltingPoint) { $null } else { [double]$p.meltingPoint })
    boilingPoint = $(if ($null -eq $p.boilingPoint) { $null } else { [double]$p.boilingPoint })
    discoveryYear = $year
    discoveryLabel = $discoveryLabel
    discoveredBy = $discoverer
    description = $description
    sourceUrl = "https://pubchem.ncbi.nlm.nih.gov/element/$n"
  }
}

$json = $elements | ConvertTo-Json -Depth 8
$header = @"
/**
 * Dataset local de los 118 elementos para Elementa.
 * Temperaturas: kelvin. Densidad: g/cm³. null = no determinado.
 * Generado desde snapshots de PubChem y Periodic-Table-JSON; textos y
 * normalizaciones en español son propios de este proyecto.
 */
window.PERIODIC_ELEMENTS =
"@
$content = $header + $json + ";`n"
$absoluteOutput = Join-Path (Get-Location) $OutputPath
[System.IO.File]::WriteAllText($absoluteOutput, $content, $utf8NoBom)

Write-Host "Generados $($elements.Count) elementos en $OutputPath"
