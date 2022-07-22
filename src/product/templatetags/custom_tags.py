from datetime import time
from django import template

register = template.Library()





  
@register.filter
def daysAgo(value):
  """
    Returns the value turned into a list.
  """
  from datetime import datetime, date
  d1 = datetime.strptime(value, r"%B %d %Y")
  
  return (datetime.now()- d1).days


@register.filter
def unique_val(queryset):
    a = set()
    for i in list(queryset):
      
      a.add(i.variant_title)
    return list(a)
    
@register.filter
def summary_data_first(value):
  return (value -1) * 3 + 1

@register.filter
def summary_data_second(value, total):
  if (value) * 3 > total:
    return total
  return (value) * 3 
  


@register.simple_tag(takes_context=True)
def param_replace(context, **kwargs):
    d = context['request'].GET.copy()
    for k, v in kwargs.items():
        d[k] = v
    for k in [k for k, v in d.items() if not v]:
        del d[k]
    return d.urlencode()