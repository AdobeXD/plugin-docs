
<a name="classlist" id="classlist"></a>

## ClassList ⇐ [`DOMTokenList`](#domtokenlist)
**Kind**: global class  
**Extends**: [`DOMTokenList`](#domtokenlist)  
**See**: https://dom.spec.whatwg.org/#dom-element-classlist  

* [ClassList](#classlist) ⇐ [`DOMTokenList`](#domtokenlist)
    * [new ClassList()](#new-classlist-new)
    * _instance_
        * [.value](#classlist-value) : `string`
        * [.length](#domtokenlist-length)
        * [.add(...tokens)](#domtokenlist-add)
        * [.remove(...tokens)](#domtokenlist-remove)
        * [.replace(oldToken, newToken)](#domtokenlist-replace)
        * [.toggle(token, force)](#domtokenlist-toggle) ⇒ `boolean`
        * [.item(index)](#domtokenlist-item) ⇒ `string`
        * [.contains(token)](#domtokenlist-contains) ⇒ `boolean`
        * [.supports(token)](#domtokenlist-supports) ⇒ `boolean`
    * _static_
        * [.ClassList](#classlist-classlist)
            * [new ClassList(node)](#new-classlist-classlist-new)


<a name="new-classlist-new" id="new-classlist-new"></a>

### new ClassList()
Implements classlist


<a name="classlist-value" id="classlist-value"></a>

### classList.value : `string`
**Kind**: instance property of [`ClassList`](#classlist)  
**Overrides**: [`value`](#domtokenlist-value)  

<a name="domtokenlist-length" id="domtokenlist-length"></a>

### classList.length
Returns the number of tokens in the list

**Kind**: instance property of [`ClassList`](#classlist)  
**Read only**: true  
**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-length  

<a name="domtokenlist-add" id="domtokenlist-add"></a>

### classList.add(...tokens)
Adds the specified tokens to the token list. If the token is already present, no error is thrown.

**Kind**: instance method of [`ClassList`](#classlist)  
**Throws**:

- [`DOMException`](#domexception) 

**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-add  

| Param | Type |
| --- | --- |
| ...tokens | `string` | 


<a name="domtokenlist-remove" id="domtokenlist-remove"></a>

### classList.remove(...tokens)
Removes the specified items from the token list. If the token is not present, no error is thrown.

**Kind**: instance method of [`ClassList`](#classlist)  
**Throws**:

- [`DOMException`](#domexception) 

**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-remove  

| Param | Type |
| --- | --- |
| ...tokens | `string` | 


<a name="domtokenlist-replace" id="domtokenlist-replace"></a>

### classList.replace(oldToken, newToken)
Replaces an old token with a new token. If the old token doesn't exist,
no action occurs, and `false` is returned.

**Kind**: instance method of [`ClassList`](#classlist)  
**Throws**:

- [`DOMException`](#domexception) 

**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-replace  

| Param | Type |
| --- | --- |
| oldToken | `any` | 
| newToken | `any` | 


<a name="domtokenlist-toggle" id="domtokenlist-toggle"></a>

### classList.toggle(token, force) ⇒ `boolean`
Toggles a token within the list. If `force` is not present, then the following
rules are applied:

* if the token is present, it is removed, and `false` is returned
* if the token isn't present, it is added, and `true` is returned

If `force` is supplied, then:

* if `true`, the token is added
* if `false`, the token is removed

**Kind**: instance method of [`ClassList`](#classlist)  
**Returns**: `boolean` - if the token exists in the last after the operation  
**Throws**:

- [`DOMException`](#domexception) 

**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-toggle  

| Param | Type |
| --- | --- |
| token | `string` | 
| force | `boolean` | 


<a name="domtokenlist-item" id="domtokenlist-item"></a>

### classList.item(index) ⇒ `string`
Return the item at the specified index, or `null` if the index is out-of-range

**Kind**: instance method of [`ClassList`](#classlist)  
**Returns**: `string` - the item at the index, or null if index is out of range  
**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-item  

| Param | Type |
| --- | --- |
| index | `number` | 


<a name="domtokenlist-contains" id="domtokenlist-contains"></a>

### classList.contains(token) ⇒ `boolean`
Returns whether the token is in the list or not.

**Kind**: instance method of [`ClassList`](#classlist)  
**Returns**: `boolean` - if `true`, the token is in the list, otherwise it isn't  
**Throws**:

- [`DOMException`](#domexception) 

**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-contains  

| Param | Type |
| --- | --- |
| token | `any` | 


<a name="domtokenlist-supports" id="domtokenlist-supports"></a>

### classList.supports(token) ⇒ `boolean`
Returns `true` if the token is acceptable to the list; otherwise returns `false`.
If `false` is returned, passing the token would throw an error when calling
any other method.

**Kind**: instance method of [`ClassList`](#classlist)  
**Returns**: `boolean` - if `true`, the token is acceptable when calling other methods  
**See**: https://dom.spec.whatwg.org/#dom-domtokenlist-supports  

| Param | Type |
| --- | --- |
| token | `string` | 


<a name="classlist-classlist" id="classlist-classlist"></a>

### ClassList.ClassList
**Kind**: static class of [`ClassList`](#classlist)  

<a name="new-classlist-classlist-new" id="new-classlist-classlist-new"></a>

#### new ClassList(node)
Creates an instance of ClassList.


| Param | Type |
| --- | --- |
| node | `any` | 

