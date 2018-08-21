
<a name="dragevent" id="dragevent"></a>

## DragEvent ⇐ [`BaseUIEvent`](#baseuievent)
**Kind**: global class  
**Extends**: [`BaseUIEvent`](#baseuievent)  
**Access**: public  
**See**: https://developer.mozilla.org/en-US/docs/Web/API/DragEvent  

* [DragEvent](#dragevent) ⇐ [`BaseUIEvent`](#baseuievent)
    * [new DragEvent(type, eventInit)](#new-dragevent-new)
    * [.dataTransfer](#dragevent-datatransfer)
    * [.pointerId](#baseuievent-pointerid)
    * [.width](#baseuievent-width) : `number`
    * [.height](#baseuievent-height) : `number`
    * [.presure](#baseuievent-presure) : `number`
    * [.tangentialPressure](#baseuievent-tangentialpressure) : `number`
    * [.tiltX](#baseuievent-tiltx) : `number`
    * [.tiltY](#baseuievent-tilty) : `number`
    * [.twist](#baseuievent-twist) : `number`
    * [.clientX](#baseuievent-clientx) : `number`
    * [.clientY](#baseuievent-clienty) : `number`
    * [.offsetX](#baseuievent-offsetx) : `number`
    * [.offsetY](#baseuievent-offsety) : `number`
    * [.pageX](#baseuievent-pagex) : `number`
    * [.pageY](#baseuievent-pagey) : `number`
    * [.screenX](#baseuievent-screenx) : `number`
    * [.screenY](#baseuievent-screeny) : `number`
    * [.movementX](#baseuievent-movementx) : `number`
    * [.movementY](#baseuievent-movementy) : `number`
    * [.button](#baseuievent-button) : `number`
    * [.buttons](#baseuievent-buttons)
    * [.detail](#baseuievent-detail)
    * [.pointerType](#baseuievent-pointertype)
    * [.altKey](#baseuievent-altkey)
    * [.shiftKey](#baseuievent-shiftkey)
    * [.metaKey](#baseuievent-metakey)
    * [.ctrlKey](#baseuievent-ctrlkey)
    * [.isPrimary](#baseuievent-isprimary)
    * [.type](#event-type)
    * [.isTrusted](#event-istrusted) : `boolean`
    * [.target](#event-target) : [`Node`](#node)
    * [.currentTarget](#event-currenttarget) : [`Node`](#node)
    * [.bubbles](#event-bubbles) : `boolean`
    * [.cancelable](#event-cancelable) : `boolean`
    * [.eventPhase](#event-eventphase)
    * [.defaultPrevented](#event-defaultprevented) : `boolean`
    * [.returnValue](#event-returnvalue) : `\*`
    * [.preventDefault()](#event-preventdefault)
    * [.stopImmediatePropagation()](#event-stopimmediatepropagation)
    * [.stopPropagation()](#event-stoppropagation)


<a name="new-dragevent-new" id="new-dragevent-new"></a>

### new DragEvent(type, eventInit)
Creates an instance of DragEvent.


| Param | Type |
| --- | --- |
| type | `\*` | 
| eventInit | `\*` | 


<a name="dragevent-datatransfer" id="dragevent-datatransfer"></a>

### dragEvent.dataTransfer
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-pointerid" id="baseuievent-pointerid"></a>

### dragEvent.pointerId
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-width" id="baseuievent-width"></a>

### dragEvent.width : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-height" id="baseuievent-height"></a>

### dragEvent.height : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-presure" id="baseuievent-presure"></a>

### dragEvent.presure : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-tangentialpressure" id="baseuievent-tangentialpressure"></a>

### dragEvent.tangentialPressure : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-tiltx" id="baseuievent-tiltx"></a>

### dragEvent.tiltX : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-tilty" id="baseuievent-tilty"></a>

### dragEvent.tiltY : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-twist" id="baseuievent-twist"></a>

### dragEvent.twist : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-clientx" id="baseuievent-clientx"></a>

### dragEvent.clientX : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-clienty" id="baseuievent-clienty"></a>

### dragEvent.clientY : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-offsetx" id="baseuievent-offsetx"></a>

### dragEvent.offsetX : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-offsety" id="baseuievent-offsety"></a>

### dragEvent.offsetY : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-pagex" id="baseuievent-pagex"></a>

### dragEvent.pageX : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-pagey" id="baseuievent-pagey"></a>

### dragEvent.pageY : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-screenx" id="baseuievent-screenx"></a>

### dragEvent.screenX : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-screeny" id="baseuievent-screeny"></a>

### dragEvent.screenY : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-movementx" id="baseuievent-movementx"></a>

### dragEvent.movementX : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-movementy" id="baseuievent-movementy"></a>

### dragEvent.movementY : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-button" id="baseuievent-button"></a>

### dragEvent.button : `number`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-buttons" id="baseuievent-buttons"></a>

### dragEvent.buttons
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-detail" id="baseuievent-detail"></a>

### dragEvent.detail
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-pointertype" id="baseuievent-pointertype"></a>

### dragEvent.pointerType
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-altkey" id="baseuievent-altkey"></a>

### dragEvent.altKey
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-shiftkey" id="baseuievent-shiftkey"></a>

### dragEvent.shiftKey
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-metakey" id="baseuievent-metakey"></a>

### dragEvent.metaKey
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-ctrlkey" id="baseuievent-ctrlkey"></a>

### dragEvent.ctrlKey
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="baseuievent-isprimary" id="baseuievent-isprimary"></a>

### dragEvent.isPrimary
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-type" id="event-type"></a>

### dragEvent.type
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-istrusted" id="event-istrusted"></a>

### dragEvent.isTrusted : `boolean`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-target" id="event-target"></a>

### dragEvent.target : [`Node`](#node)
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-currenttarget" id="event-currenttarget"></a>

### dragEvent.currentTarget : [`Node`](#node)
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-bubbles" id="event-bubbles"></a>

### dragEvent.bubbles : `boolean`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-cancelable" id="event-cancelable"></a>

### dragEvent.cancelable : `boolean`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-eventphase" id="event-eventphase"></a>

### dragEvent.eventPhase
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-defaultprevented" id="event-defaultprevented"></a>

### dragEvent.defaultPrevented : `boolean`
**Kind**: instance property of [`DragEvent`](#dragevent)  
**Read only**: true  

<a name="event-returnvalue" id="event-returnvalue"></a>

### dragEvent.returnValue : `\*`
**Kind**: instance property of [`DragEvent`](#dragevent)  

<a name="event-preventdefault" id="event-preventdefault"></a>

### dragEvent.preventDefault()
**Kind**: instance method of [`DragEvent`](#dragevent)  

<a name="event-stopimmediatepropagation" id="event-stopimmediatepropagation"></a>

### dragEvent.stopImmediatePropagation()
**Kind**: instance method of [`DragEvent`](#dragevent)  

<a name="event-stoppropagation" id="event-stoppropagation"></a>

### dragEvent.stopPropagation()
**Kind**: instance method of [`DragEvent`](#dragevent)  
