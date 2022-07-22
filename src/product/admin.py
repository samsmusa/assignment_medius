from django.contrib import admin
from .models import Product, ProductVariant, ProductVariantPrice

# Register your models here.

admin.site.register(Product)
admin.site.register(ProductVariantPrice)
admin.site.register(ProductVariant)

