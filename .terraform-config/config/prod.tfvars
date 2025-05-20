subscription = "REPLACE_WITH_SUBSCRIPTION_ID"

cname_domain        = "prod.ogd-meteoswiss.ch"
location            = "westeurope"
location_name_short = "weu"
environment         = "prod"
sku_tier            = "Standard"
sku_size            = "Standard"
subscription_name   = "webguistac"
tags = {
  "description"   = "Web-GUI STAC"
  "environment"   = "PROD"
  "customer"      = "meteoschweiz"
  "projectnumber" = "224488.10"
  "IaC"           = "terraform"
}
