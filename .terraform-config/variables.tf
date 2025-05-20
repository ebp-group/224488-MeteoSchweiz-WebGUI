variable "subscription" {
  type        = string
  description = "ID of the subscription"
}

variable "cname_domain" {
  type        = string
  default     = "test.ogd-meteoswiss.ch"
  description = "The domain for the CNAME record."
}

variable "location" {
  type    = string
  default = "switzerlandnorth"
}

variable "location_name_short" {
  type    = string
  default = "chn"
}

variable "environment" {
  type        = string
  default     = "test"
  description = "Environment (e.g. dev, test, prod)"
}

variable "sku_tier" {
  type        = string
  default     = "Standard"
  description = "The SKU tier for the Static Web App; can be Free or Standard."
}

variable "sku_size" {
  type        = string
  default     = "Standard"
  description = "The SKU size for the Static Web App; can be Free or Standard."
}

variable "subscription_name" {
  type        = string
  default     = "webguistac"
  description = "The name of the project or application"
}

variable "tags" {
  type = map(string)
  default = {
    "description"   = "Web-GUI STAC"
    "environment"   = "TEST"
    "customer"      = "meteoschweiz"
    "projectnumber" = "224488.10"
    "IaC"           = "terraform"
  }
  description = "A map of the tags to use on the resources that are deployed with this module."
}
