<a name="module_interactions"></a>

## interactions
The `interactions` module and related APIs provide _read only_ information about the document's interactive prototype mode, including:

* The blue "wires" seen in XD's prototyping UI, known as "interactions," which specify gestures/events which trigger actions to
  occur in the prototype. Accessible as a single consolidated global listing via this module's [`allInteractions`](#module_interactions-allInteractions) API,
  or you can access information from specific nodes in the scenegraph via [`SceneNode.triggeredInteractions`](./scenegraph.md#SceneNode-triggeredInteractions)
  and [`Artboard.incomingInteractions`](./scenegraph.md#Artboard-incomingInteractions).

* Designers can author multiple prototype or interaction flows in a single document and publish unique shareable links for each flow. Developers can access all document flows using the [`flows`](#module_interactions-flows) API. With multiple flow support the [`homeArtboard`](#module_interactions-homeArtboard) API is being deprecated as XD no longer has a single home artboard restriction.

* Properties that affect Artboard scrolling behavior: Artboard [`viewportHeight`](./scenegraph.md#Artboard-viewportHeight) and
  node [`fixedWhenScrolling`](./scenegraph.md#SceneNode-fixedWhenScrolling).

> **Tip**
> Interactions are a **fast-changing area** in XD. APIs here have a higher likelihood of becoming deprecated, or lagging behind new XD features, than other parts of XD's plugin APIs.

**Since**: XD 19+ (some APIs added later)

**Example**
```js
// Get all interactions in the entire document (grouped by triggering node)
var allInteractions = require("interactions").allInteractions;

// Get interactions triggered by the selected node
var nodeInteractions = selection.items[0].triggeredInteractions;

// Get all interactions leading to a particular artboard
var artboard = ...
var interactionsToArtboard = artboard.incomingInteractions;

// Print out details of one particular interaction
var interaction = ...
console.log("Trigger: " + interaction.trigger.type + " -> Action: " + interaction.action.type);
```

See [Interaction documentation](#Interaction) below for an example of what an Interaction object looks like.

* [interactions](#module_interactions)
    * [.homeArtboard](#module_interactions-homeArtboard) : <code>?Artboard</code>
    * [.flows](#module_interactions-flows) : <code>!Array&lt;!FlowInfo&gt;</code>
    * [.allInteractions](#module_interactions-allInteractions) : <code>!Array&lt;!{triggerNode: !SceneNode, interactions: !Array&lt;!Interaction&gt;}&gt;</code>
* Typedefs:
    * [Interaction](#Interaction)
    * [Trigger](#Trigger)
    * [Action](#Action)
    * [Transition](#Transition)
    * [FlowInfo](#FlowInfo)


## Typedefs

<a name="Interaction" id="Interaction"></a>

### Typedef Interaction
An interaction consists of a Trigger + Action pair and is attached to a single, specific scenenode.

| Property | Type | Description |
| --- | --- | --- |
| trigger | \![Trigger](#Trigger) | User gesture or other event which will trigger the action. |
| action | \![Action](#Action) | Action that occurs. |

**Example:**
```js
{
    trigger: { 
        type: "tap"
    },
    action: {
        type: "goToArtboard",
        destination: /* Artboard node */,
        preserveScrollPosition: false,
        transition: {
            type: "dissolve",
            duration: 0.4,
            easing: "ease-out"
        }
    }
}
```

> **Tip**
> Note: Interaction objects are _not_ plain JSON -- they may reference scenenodes (as seen above) and other strongly-typed objects.

<a name="Trigger" id="Trigger"></a>

### Typedef Trigger
Event which triggers an interaction.

| Property | Type | Description |
| --- | --- | --- |
| type | string | One of the trigger types listed below. |

> **Tip**
> Note: Additional trigger types may be added in the future. Always be sure to have a default case for unknown triggers when
> working with Interaction objects.

##### "tap"
When the user clicks or taps on a scenenode.

##### "drag"
When the user drags or swipes a scenenode. Can only trigger a `goToArtboard` action with the `autoAnimate` transition style.

##### "time"
Once a set amount of time elapses (this trigger type only exists on Artboard nodes). Additional Trigger properties:

| Property | Type | Description |
| --- | --- | --- |
| delay | number | Delay time in ms. |

##### "voice"
When the user speaks a specific voice command. Additional Trigger properties:

| Property | Type | Description |
| --- | --- | --- |
| speechCommand | string | Phrase the user speaks to trigger this command. |

<a name="Action" id="Action"></a>

### Typedef Action
Action performed when the trigger occurs.

| Property | Type | Description |
| --- | --- | --- |
| type | string | One of the action types listed below. |

> **Tip**
> Note: Additional action types may be added in the future. Always be sure to have a default case for unknown actions when
> working with Interaction objects.

##### "goToArtboard"
Navigate the entire screen to view a different artboard. Additional Action properties:

| Property | Type | Description |
| --- | --- | --- |
| destination | !Artboard | Artboard to navigate to. |
| transition | \![Transition](#Transition) | Animation style with which the view transitions from the old Artboard to the new one. |
| preserveScrollPosition | boolean | If both Artboards are [taller than the viewport](./scenegraph.md#Artboard-viewportHeight), attempts to keep the user's current scroll position the same as in the outgoing artboard. |

##### "overlay"
Displays a second artboard overlaid on top of the current one. Additional Action properties:

| Property | Type | Description |
| --- | --- | --- |
| overlay | !Artboard | Artboard to show on top. |
| transition | \![Transition](#Transition) | Animation style in which the second Artboard transitions into view. Only certain transition types are allowed for overlays. |
| overlayTopLeft | `!{x:number, y:number}` | Position of the overlay Artboard, in the current/base Artboard's coordinate space. |

##### "goBack"
Reverse the last `"goToArtboard"` or `"overlay"` action, replaying in reverse whatever transition it used.

##### "speak"
Speak with audio output to the user. Additional Action properties:

| Property | Type | Description |
| --- | --- | --- |
| speechOutput | string | Phrase to speak to the user. |
| locale | string | Locale determines the pronounciation and accent of the digital voice. Includes both language *and* region (e.g. "en-us"). |
| voice | string | "Persona" of the digital voice to use. Available personas vary by locale. |

<a name="Transition" id="Transition"></a>

### Typedef Transition
Animation style with which `"goToArtboard"` and `"overlay"` actions transition from/to Artboards.

| Property | Type | Description |
| --- | --- | --- |
| type | string | One of: `"autoAnimate"`, `"dissolve"`, `"push"`, `"slide"`, `"none"` |
| fromSide | string | _(If type = "push" or "slide")._ One of: `"L"`, `"R"`, `"T"`, `"B"` |
| duration | number | Length of animation in seconds. |
| easing | string | One of: `"linear"`, `"ease-in"`, `"ease-out"`, `"ease-in-out"`, `"wind-up"`, `"bounce"`, `"snap"` |

<a name="FlowInfo" id="FlowInfo"></a>

### Typedef FlowInfo
Information related to a particular flow

| Property | Type | Description |
| --- | --- | --- |
| name | string | Auto-generated or user-defined label for a particular flow. |
| homeArtboard | \![Artboard](./scenegraph.md#Artboard) | Artboard from which a particular flow or a prototype experience begins. |
| url | string | URL is the latest published link associated with a particular flow and can be `null` in case no link is published for that flow. |

NOTE: All `url` returned via [flows](#module_interactions-flows) are related to published flows and are usually a subset of the URLs returned via [getSharedArtifacts](./cloud.md#module_cloud-getSharedArtifacts). However, the reverse may or may not always hold true.

* * *

<a name="module_interactions-homeArtboard"></a>

### *interactions.homeArtboard : <code>?Artboard</code>*
The starting Artboard seen when the interactive prototype is launched. 

**Deprecated**: XD 33 - Please use [`flows`](#module_interactions-flows) which supports multple flows. 

**Since**: XD 32 

In case there are multiple interactive prototype experiences (flows), implying multiple home artboards, this API only returns the top-left artboard among all of those home artboards.

**Kind**: static property of [<code>interactions</code>](#module_interactions)
**Read only**: true

**See**: [`Artboard.isHomeArtboard`](./scenegraph.md#Artboard-isHomeArtboard)


* * *

<a name="module_interactions-flows"></a>

### *interactions.flows : <code>!Array&lt;\![FlowInfo](#FlowInfo)&gt;</code>*

**Since**: XD 33 

Returns a collection of information on *all* flows across the entire document.

A `flow` is a series or set of artboards starting from one artboard (called a home artboard), which are connected to other artboards or screens via wires or interactions. A document can have zero or multiple (one or more than one) flows and can therefore have zero or multiple home artboards. Each entry in the return array represents a `FlowInfo` object.

**Kind**: static property of [<code>interactions</code>](#module_interactions)
**Read only**: true

* * *

<a name="module_interactions-allInteractions"></a>

### *interactions.allInteractions : <code>!Array&lt;!{triggerNode: !SceneNode, interactions: !Array&lt;\![Interaction](#Interaction)&gt;}&gt;</code>*
Returns a collection of *all* interactions across the entire document, grouped by triggering scenenode. Each entry in this array
specifies a `triggerNode` and the result of getting [`triggerNode.triggeredInteractions`](./scenegraph.md#SceneNode-triggeredInteractions).

May include interactions that are impossible to trigger because the trigger node (or one of its ancestors) has `visible` = false.

> **Tip**
> Currently, this API excludes some types of interactions: keypress/gamepad, scrolling, hover, component state transitions, or non-speech audio playback.

**Kind**: static property of [<code>interactions</code>](#module_interactions)
**Read only**: true
