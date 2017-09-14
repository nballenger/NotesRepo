# Notes on Observer classes in the Sketchup API

## General Observer Notes

* To use them, subclass and override the desired methods

## Observer Classes

* `AppObserver`
    * React to application events, often used to attach other observers to models as they are opened or started, to ensure your observers are watching all open models.
    * Instance methods:
        * `expectsStartupModelNotifications`
        * `onActivateModel(model)`
        * `onNewModel(model)`
        * `onOpenModel(model)`
        * `onQuit`
        * `onUnloadExtension(extension_name)`
* `DefinitionObserver`
    * React to component definition events.
    * To use, subclass and add an instance to the definitions of interest.
    * Instance methods:
        * `onComponentInstanceAdded(definition, instance)`
        * `onComponentInstanceRemoved(definition, instance)`
* `DefinitionsObserver`
    * React to events on a definitions collection
    * Subclass and add an instance of the observer to the collection
    * Instance methods:
        * `onComponentAdded(definitions, definition)`
        * `onComponentPropertiesChanged(definitions, definition)`
        * `onComponentRemoved(definitions, definition)`
        * `onComponentTypeChanged(definitions, definition)`
* `DimensionObserver`
    * React to changes in dimension text
    * Instance methods:
        * `onTextChanged(dimension)`
* `EntitiesObserver`
    * Making changes to the model while inside the methods of this class is dangerous, and can cause crashes. Use a `ToolsObserver` to watch what the user is doing instead.
    * React to `Entities` collection events. Subclass and add an instance to the objects of interest.
    * Instance methods:
        * `onActiveSectionPlaneChanged(entities)`
        * `onElementAdded(entities, entity)`
        * `onElementModified(entities, entity)`
        * `onElementRemoved(entities, entity_id)`
        * `onEraseEntities(entities)`
* `EntityObserver`
    * Also dangerous to change the model inside these methods.
    * React to entity events. Subclass and add an instance to the entity of interest.
    * Instance methods:
        * `onChangeEntity(entity)`
        * `onEraseEntity(entity)`
* `FrameChangeObserver`
    * Abstract class; implement the methods to create a frame change observer. Cannot be subclassed.
    * React to changes in camera position between one scene page and another.
    * Used by attaching using `Pages.add_frame_change_observer`
    * Instance methods:
        * `frameChange(from_page, to_page, percent_done)`
* `InstanceObserver`
    * React to component instance events. Subclass and add instance to the objects of interest.
    * Can also be attached to groups
    * Instance methods:
        * `onClose(instance)`
        * `onOpen(instance)`
        * `onChangeEntity`
        * `onEraseEntity`
* `LayersObserver`
    * React to layers events. Subclass and add instance to the objects of interest.
    * Instance methods:
        * `onCurrentLayerChanged(layers, layer)`
        * `onLayerAdded(layers, layer)`
        * `onLayerChanged(layers, layer)`
        * `onLayerRemoved(layers, layer)`
        * `onRemoveAllLayers(layers)`
* `MaterialsObserver`
    * Note that `onMaterialRemoveAll` is deprecated in favor of `onMaterialRemove`
    * React to materials events. Subclass and add an instance to the objects of interest.
    * Instance methods:
        * `onMaterialAdd(materials, material)`
        * `onMaterialChange(materials, material)`
        * `onMaterialRefChange(materials, material)`
        * `onMaterialRemove(materials, material)`
        * `onMaterialSetCurrent(materials, material)`
        * `onMaterialUndoRedo(materials, material)`
* `ModelObserver`
    * React to model events. Subclass and add an instance to the model.
    * Note that observers related to transactions are primarily for reporting and debugging.
    * Avoid edit operations inside the observer callback, can cause crashes and corruption.
    * Most common usage is to debug when your use of `Sketchup::Model#start_operation` and `#commit_operation` are conflicting with Sketchup's native undo operations.
    * Instance methods:
        * `onActivePathChanged(model)`
        * `onAfterComponentSaveAs(model)`
        * `onBeforeComponentSaveAs(model)`
        * `onDeleteModel(model)`
        * `onEraseAll(model)`
        * `onExplode(model)`
        * `onPidChanged(model, old_pid, new_pid)`
        * `onPlaceComponent(model)`
        * `onPostSaveModel(model)`
        * `onPreSaveModel(model)`
        * `onSaveModel(model)`
        * `onTransactionAbort(model)`
        * `onTransactionCommit(model)`
        * `onTransactionEmpty(model)`
        * `onTransactionRedo(model)`
        * `onTransactionStart(model)`
        * `onTransactionUndo(model)`
* `OptionsProviderObserver`
    * React to operations provider events. You can watch as the user changes SketchUp options and react.
    * Instance methods:
        * `onOptionsProviderChanged(provider, name)`
* `PagesObserver`
    * React to pages events.
    * Instance methods:
        * `onContentsModified(pages)`
        * `onElementAdded(pages, page)`
        * `onElementRemoved(pages, page)`
        * `onActiveSectionPlaneChanged`
        * `onElementModified`
        * `onEraseEntities`
* `RenderingOptionsObserver`
    * React to rendering options events.
    * Instance methods:
        * `onRenderingOptionsChanged(rendering_options, type)`
* `SelectionObserver`
    * React to selection events.
    * Instance methods:
        * `onSelectionAdded(selection, entity)`
        * `onSelectionBulkChange(selection)`
        * `onSelectionCleared(selection)`
        * `onSelectionRemoved(selection, entity)`
* `ShadowInfoObserver`
    * React to changes to the shadow settings.
    * Instance methods:
        * `onShadowInfoChanged(shadow_info, type)`
* `ToolsObserver`
    * React to tool events.
    * Refer to documentation for `tool_names` and `tool_ids`
    * Instance methods:
        * `onActiveToolChanged(tools, tool_name, tool_id)`
        * `onToolStateChanged(tools, tool_name, tool_id, tool_state)`
* `ViewObserver`
    * React to view events--whenever the view is altered, as via pan, orbit, zoom
    * Instance methods:
        * `onViewChanged(view)`
