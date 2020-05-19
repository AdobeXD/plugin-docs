GitBook collapse
==============

## install
open book.json, add collapse in "plugins"

{
    "plugins": [ "other-plugin", "collapse" ]
}

## usage
wrap the content you want to collapse with:

```html
{% collapse %}

* list 1
* list 2
* list 3
    * list 3.1
    
{% endcollapse %}
```

you can specify a title with

```html
{% collapse title="my list" %}

* list 1
* list 2
* list 3
    * list 3.1
    
{% endcollapse %}
``` 

specify no process in the block

```html
{% collapse title="my list", process=false %}

<h1>hello</h1>
    
{% endcollapse %}
``` 

## Todo

* [ ] hide collapses in pdf, ebook etc