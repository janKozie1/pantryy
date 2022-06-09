
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }
    class HtmlTag {
        constructor(is_svg = false) {
            this.is_svg = false;
            this.is_svg = is_svg;
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                if (this.is_svg)
                    this.e = svg_element(target.nodeName);
                else
                    this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* ..\node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.48.0 */

    const file$p = "..\\node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$7(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$p, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$p, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$u($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$u,
    			create_fragment$u,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* ..\node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.48.0 */
    const file$o = "..\\node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$6(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$a(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$o, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$o, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$t($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* ..\node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.48.0 */
    const file$n = "..\\node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$s(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$n, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$s.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    const Routes = {
        login: '/login',
        register: '/register',
        pantry: '/pantry',
        product: '/pantry/:id',
        home: '/'
    };
    const ApiPrefix = '/api';
    const ApiEndpoints = {
        login: '/auth/login',
        register: '/auth/register',
        getMeasurmentUnits: '/pantry/measurmentUnits',
        createPantryItem: '/pantry/item',
        getPantryItem: '/pantry/item/:id',
        updatePantryItem: '/pantry/item/:id',
        deletePantryItem: '/pantry/item/:id',
        getPantryItems: '/pantry/items',
    };

    const makeScopedFetch = (apiPrefix) => (...args) => {
        const [requestURI, ...other] = args;
        return fetch(`${apiPrefix}${requestURI}`, ...other);
    };
    const makeSendJSON = (scopedFetch) => (...args) => {
        const [url, params] = args;
        return scopedFetch(url, Object.assign(Object.assign({}, params), { method: "POST", headers: {
                "Content-type": "application/json"
            }, body: params.body }));
    };

    const isString = (arg) => typeof arg === 'string';
    const isNil = (arg) => arg === null || arg === undefined;
    const isNotNil = (arg) => !isNil(arg);
    const isLiteral = (arg) => {
        if (typeof arg !== 'object') {
            return false;
        }
        if (isNil(arg)) {
            return false;
        }
        if (Object.getPrototypeOf(arg) === null) {
            return true;
        }
        return Object.getPrototypeOf(Object.getPrototypeOf(arg)) === null;
    };
    function isEmpty(arg) {
        if (arg === null || arg === undefined) {
            return true;
        }
        if (isString(arg) && arg.trim() === '') {
            return true;
        }
        if (isLiteral(arg) && Object.keys(arg).length === 0) {
            return true;
        }
        if (Array.isArray(arg) && arg.length === 0) {
            return true;
        }
        return false;
    }

    const getUnparsedCookies = () => document.cookie.split(';');
    const getCookieName = (cookie) => { var _a; return (_a = (cookie.split("=")[0])) === null || _a === void 0 ? void 0 : _a.trim(); };
    const getCookieValue = (cookie) => { var _a; return (_a = (cookie.split("=")[1])) === null || _a === void 0 ? void 0 : _a.trim(); };
    const getCookies = () => getUnparsedCookies().map((cookie) => {
        const cookieName = getCookieName(cookie);
        const cookieValue = getCookieValue(cookie);
        return isEmpty(cookieName) ? null : [cookieName, isEmpty(cookieValue) ? null : cookieValue];
    }).filter(isNotNil).reduce((acc, [name, value]) => (Object.assign(Object.assign({}, acc), { [name]: value })), {});
    const getCookie = (cookieName) => getCookies()[cookieName];
    const removeCookie = (cookieName) => {
        document.cookie = `${cookieName}=; expires=${new Date(0).toUTCString()};`;
    };

    const makeLogin = ({ sendJSON }, { requestEndpoints }) => async (data) => {
        try {
            const response = await sendJSON(requestEndpoints.login, {
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                })
            });
            if (response.ok) {
                const body = await response.json();
                return body;
            }
            return null;
        }
        catch (_a) {
            return null;
        }
    };
    const makeRegister = ({ sendJSON }, { requestEndpoints }) => async (data) => {
        try {
            const response = await sendJSON(requestEndpoints.register, {
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    repeatedPassword: data.repeatedPassword
                })
            });
            if (response.ok) {
                const body = await response.json();
                return body;
            }
            return null;
        }
        catch (_a) {
            return null;
        }
    };
    const makeIsLoggedIn = (_, { authCookieName }) => () => !isEmpty(getCookie(authCookieName));
    const makeLogout = (_, { authCookieName, redirect }) => () => {
        removeCookie(authCookieName);
        redirect.toLogin();
    };
    const makeAuthService$1 = (config, serviceConfig) => ({
        login: makeLogin(config, serviceConfig),
        register: makeRegister(config, serviceConfig),
        isLoggedIn: makeIsLoggedIn(config, serviceConfig),
        logout: makeLogout(config, serviceConfig),
    });

    const isEmail = (arg) => isString(arg) && (/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/).test(arg);
    const errorMessages = {
        NOT_EMPTY: 'Must not be empty',
        VALID_EMAIL: 'Must be a valid email',
        PASSWORDS_DONT_MATCH: 'Passwords must match',
        VALID_FILE: 'Must be a valid file',
        NOT_SELECTED: 'One of the options must be selected',
    };
    const isFile = (arg) => !isNil(arg) && arg instanceof File;
    const isNotEmptyFile = (arg) => isFile(arg) && !isEmpty(arg.name) && arg.size !== 0;
    const isEmptyFile = (arg) => isFile(arg) && !isNotEmptyFile(arg);

    const hasErrors = (obj) => Object.values(obj).some(isNotNil);
    const makeValidateLoginFields = () => ({ email, password }) => {
        const errors = {
            email: isEmpty(email)
                ? errorMessages.NOT_EMPTY
                : !isEmail(email)
                    ? errorMessages.VALID_EMAIL
                    : null,
            password: isEmpty(password)
                ? errorMessages.NOT_EMPTY
                : null,
        };
        const isValid = !hasErrors(errors);
        return {
            isValid,
            errors,
            validFields: isValid ? {
                email,
                password
            } : null,
        };
    };
    const makeValidateRegisterFields = () => ({ email, password, repeatedPassword, }) => {
        const errors = {
            email: isEmpty(email)
                ? errorMessages.NOT_EMPTY
                : !isEmail(email)
                    ? errorMessages.VALID_EMAIL
                    : null,
            password: isEmpty(password)
                ? errorMessages.NOT_EMPTY
                : null,
            repeatedPassword: isEmpty(password)
                ? errorMessages.NOT_EMPTY
                : password !== repeatedPassword
                    ? errorMessages.PASSWORDS_DONT_MATCH
                    : null,
        };
        const isValid = !hasErrors(errors);
        return {
            isValid,
            errors,
            validFields: isValid ? {
                email,
                password,
                repeatedPassword,
            } : null,
        };
    };
    const makeValidateAddPantryItemFields = () => ({ name, image, description, unit }) => {
        const errors = {
            name: isEmpty(name)
                ? errorMessages.NOT_EMPTY
                : null,
            image: !isNotEmptyFile(image)
                ? errorMessages.VALID_FILE
                : null,
            description: isEmpty(description)
                ? errorMessages.NOT_EMPTY
                : null,
            unit: isEmpty(unit)
                ? errorMessages.NOT_SELECTED
                : null
        };
        const isValid = !hasErrors(errors);
        return {
            isValid,
            errors,
            validFields: isValid ? {
                name,
                image,
                description,
                unit
            } : null,
        };
    };
    const makeValidateEditPantryItemFields = () => ({ name, image, description, unit, id, }) => {
        const errors = {
            name: isEmpty(name)
                ? errorMessages.NOT_EMPTY
                : null,
            image: isEmptyFile(image)
                ? null
                : !isNotEmptyFile(image)
                    ? errorMessages.VALID_FILE
                    : null,
            description: isEmpty(description)
                ? errorMessages.NOT_EMPTY
                : null,
            unit: isEmpty(unit)
                ? errorMessages.NOT_SELECTED
                : null,
            id: isEmpty(id)
                ? errorMessages.NOT_EMPTY
                : null,
        };
        const isValid = !hasErrors(errors);
        return {
            isValid,
            errors,
            validFields: isValid ? {
                name,
                image,
                description,
                unit,
                id,
            } : null,
        };
    };
    const makeValidationService = (config, serviceConfig) => ({
        validateLoginFields: makeValidateLoginFields(),
        validateRegisterFields: makeValidateRegisterFields(),
        validateAddPantryItemFields: makeValidateAddPantryItemFields(),
        validateEditPantryItemFields: makeValidateEditPantryItemFields(),
    });

    const generatePath = (path, args) => {
        const keyValueParams = Object.entries(args);
        return path.split('/').map((part) => {
            const matchingParam = keyValueParams.find(([key]) => part === `:${key}`);
            if (matchingParam) {
                return matchingParam[1];
            }
            return part;
        }).join('/');
    };

    const getFormData = (arg) => {
        const formData = new FormData();
        Object.entries(arg).forEach(([fieldName, fieldValue]) => {
            if (isFile(fieldValue)) {
                formData.append(fieldName, fieldValue, fieldValue.name);
            }
            else {
                formData.append(fieldName, fieldValue);
            }
        });
        return formData;
    };
    const makeGetMeasurmentUnits = ({ fetch }, { requestEndpoints }) => async () => {
        try {
            const response = await fetch(requestEndpoints.getMeasurmentUnits);
            if (response.ok) {
                const body = await response.json();
                return body;
            }
            return null;
        }
        catch (_a) {
            return null;
        }
    };
    const makeCreatePantryItem = ({ fetch }, { requestEndpoints }) => async (data) => {
        try {
            const response = await fetch(requestEndpoints.createPantryItem, {
                method: 'POST',
                body: getFormData(data),
            });
            if (response.ok) {
                const body = await response.json();
                return body;
            }
            return null;
        }
        catch (_a) {
            return null;
        }
    };
    const makeUpdatePantryItem = ({ fetch }, { requestEndpoints }) => async (data) => {
        const { id } = data;
        try {
            const response = await fetch(generatePath(requestEndpoints.updatePantryItem, { id }), {
                method: 'PATCH',
                body: getFormData(data),
            });
            if (response.ok) {
                const body = await response.json();
                return body;
            }
            return null;
        }
        catch (_a) {
            return null;
        }
    };
    const makeGetPantryItems = ({ fetch }, { requestEndpoints }) => async () => {
        try {
            const response = await fetch(requestEndpoints.getPantryItems);
            if (response.ok) {
                const body = await response.json();
                return body;
            }
        }
        catch (_a) {
            return [];
        }
    };
    const makeGetPantryItem = ({ fetch }, { requestEndpoints }) => async (id) => {
        try {
            const response = await fetch(generatePath(requestEndpoints.getPantryItem, { id }));
            if (response.ok) {
                const body = await response.json();
                return body;
            }
        }
        catch (_a) {
            return null;
        }
    };
    const makeDeletePantryItem = ({ fetch }, { requestEndpoints }) => async (id) => {
        try {
            const response = await fetch(generatePath(requestEndpoints.deletePantryItem, { id }), {
                method: "DELETE"
            });
            if (response.ok) {
                const body = await response.json();
                return body;
            }
        }
        catch (_a) {
            return null;
        }
    };
    const makeAuthService = (config, serviceConfig) => ({
        getMeasurmentUnits: makeGetMeasurmentUnits(config, serviceConfig),
        getPantryItems: makeGetPantryItems(config, serviceConfig),
        createPantryItem: makeCreatePantryItem(config, serviceConfig),
        getPantryItem: makeGetPantryItem(config, serviceConfig),
        deletePantryItem: makeDeletePantryItem(config, serviceConfig),
        updatePantryItem: makeUpdatePantryItem(config, serviceConfig),
    });

    const makeServices = (sharedConfig, specificConfigs) => ({
        auth: makeAuthService$1(sharedConfig, specificConfigs.auth),
        validation: makeValidationService(sharedConfig, specificConfigs.validation),
        externalData: makeAuthService(sharedConfig, specificConfigs.externalData),
    });
    const SERVICES_KEY = Symbol();
    const getServices = () => getContext(SERVICES_KEY);
    var services = ({ navigate }) => {
        const fetch = makeScopedFetch(ApiPrefix);
        const sendJSON = makeSendJSON(fetch);
        return makeServices({ fetch, sendJSON }, {
            auth: {
                authCookieName: 'auth',
                redirect: {
                    toLogin: () => navigate(Routes.login),
                },
                requestEndpoints: {
                    login: ApiEndpoints.login,
                    register: ApiEndpoints.register,
                }
            },
            externalData: {
                requestEndpoints: {
                    getMeasurmentUnits: ApiEndpoints.getMeasurmentUnits,
                    getPantryItem: ApiEndpoints.getPantryItem,
                    getPantryItems: ApiEndpoints.getPantryItems,
                    updatePantryItem: ApiEndpoints.updatePantryItem,
                    deletePantryItem: ApiEndpoints.deletePantryItem,
                    createPantryItem: ApiEndpoints.createPantryItem,
                },
            },
            validation: null,
        });
    };

    /* src\components\organisms\AuthRoute.svelte generated by Svelte v3.48.0 */

    function create_fragment$r(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AuthRoute', slots, ['default']);
    	let { redirectTo } = $$props;
    	let { isProtected } = $$props;
    	const services = getServices();
    	const navigate = useNavigate();
    	const writable_props = ['redirectTo', 'isProtected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AuthRoute> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('redirectTo' in $$props) $$invalidate(0, redirectTo = $$props.redirectTo);
    		if ('isProtected' in $$props) $$invalidate(1, isProtected = $$props.isProtected);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		useNavigate,
    		getServices,
    		redirectTo,
    		isProtected,
    		services,
    		navigate
    	});

    	$$self.$inject_state = $$props => {
    		if ('redirectTo' in $$props) $$invalidate(0, redirectTo = $$props.redirectTo);
    		if ('isProtected' in $$props) $$invalidate(1, isProtected = $$props.isProtected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isProtected, redirectTo*/ 3) {
    			if (services.auth.isLoggedIn() !== isProtected) {
    				navigate(redirectTo);
    			}
    		}
    	};

    	return [redirectTo, isProtected, $$scope, slots];
    }

    class AuthRoute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, { redirectTo: 0, isProtected: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuthRoute",
    			options,
    			id: create_fragment$r.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*redirectTo*/ ctx[0] === undefined && !('redirectTo' in props)) {
    			console.warn("<AuthRoute> was created without expected prop 'redirectTo'");
    		}

    		if (/*isProtected*/ ctx[1] === undefined && !('isProtected' in props)) {
    			console.warn("<AuthRoute> was created without expected prop 'isProtected'");
    		}
    	}

    	get redirectTo() {
    		throw new Error("<AuthRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redirectTo(value) {
    		throw new Error("<AuthRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isProtected() {
    		throw new Error("<AuthRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isProtected(value) {
    		throw new Error("<AuthRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\organisms\ServicesProvider.svelte generated by Svelte v3.48.0 */

    function create_fragment$q(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ServicesProvider', slots, ['default']);
    	const navigate = useNavigate();
    	setContext(SERVICES_KEY, services({ navigate }));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ServicesProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		services,
    		SERVICES_KEY,
    		setContext,
    		useNavigate,
    		navigate
    	});

    	return [$$scope, slots];
    }

    class ServicesProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ServicesProvider",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\components\atoms\Image.svelte generated by Svelte v3.48.0 */

    const file$m = "src\\components\\atoms\\Image.svelte";

    function create_fragment$p(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");

    			if (!src_url_equal(img.src, img_src_value = /*external*/ ctx[3]
    			? /*src*/ ctx[0]
    			: `/images/${/*src*/ ctx[0]}`)) attr_dev(img, "src", img_src_value);

    			attr_dev(img, "alt", /*alt*/ ctx[1]);
    			attr_dev(img, "class", /*cls*/ ctx[2]);
    			add_location(img, file$m, 6, 0, 119);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*external, src*/ 9 && !src_url_equal(img.src, img_src_value = /*external*/ ctx[3]
    			? /*src*/ ctx[0]
    			: `/images/${/*src*/ ctx[0]}`)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*alt*/ 2) {
    				attr_dev(img, "alt", /*alt*/ ctx[1]);
    			}

    			if (dirty & /*cls*/ 4) {
    				attr_dev(img, "class", /*cls*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { src } = $$props;
    	let { alt } = $$props;
    	let { cls = null } = $$props;
    	let { external = false } = $$props;
    	const writable_props = ['src', 'alt', 'cls', 'external'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    		if ('cls' in $$props) $$invalidate(2, cls = $$props.cls);
    		if ('external' in $$props) $$invalidate(3, external = $$props.external);
    	};

    	$$self.$capture_state = () => ({ src, alt, cls, external });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('alt' in $$props) $$invalidate(1, alt = $$props.alt);
    		if ('cls' in $$props) $$invalidate(2, cls = $$props.cls);
    		if ('external' in $$props) $$invalidate(3, external = $$props.external);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, alt, cls, external];
    }

    class Image extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { src: 0, alt: 1, cls: 2, external: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Image> was created without expected prop 'src'");
    		}

    		if (/*alt*/ ctx[1] === undefined && !('alt' in props)) {
    			console.warn("<Image> was created without expected prop 'alt'");
    		}
    	}

    	get src() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cls() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cls(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get external() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set external(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\atoms\Stylesheet.svelte generated by Svelte v3.48.0 */

    const file$l = "src\\components\\atoms\\Stylesheet.svelte";

    function create_fragment$o(ctx) {
    	let link;
    	let link_href_value;

    	const block = {
    		c: function create() {
    			link = element("link");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", link_href_value = `/css/${/*src*/ ctx[0]}`);
    			add_location(link, file$l, 4, 2, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*src*/ 1 && link_href_value !== (link_href_value = `/css/${/*src*/ ctx[0]}`)) {
    				attr_dev(link, "href", link_href_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stylesheet', slots, []);
    	let { src } = $$props;
    	const writable_props = ['src'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Stylesheet> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    	};

    	$$self.$capture_state = () => ({ src });

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src];
    }

    class Stylesheet extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, { src: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stylesheet",
    			options,
    			id: create_fragment$o.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*src*/ ctx[0] === undefined && !('src' in props)) {
    			console.warn("<Stylesheet> was created without expected prop 'src'");
    		}
    	}

    	get src() {
    		throw new Error("<Stylesheet>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Stylesheet>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\Logo.svelte generated by Svelte v3.48.0 */

    function create_fragment$n(ctx) {
    	let image;
    	let current;

    	image = new Image({
    			props: {
    				alt: "Pantryy logo",
    				src: /*variants*/ ctx[2][/*variant*/ ctx[0]].imgSrc,
    				cls: `logo--${/*variants*/ ctx[2][/*variant*/ ctx[0]].class} ${/*cls*/ ctx[1]}`
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(image.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(image, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const image_changes = {};
    			if (dirty & /*variant*/ 1) image_changes.src = /*variants*/ ctx[2][/*variant*/ ctx[0]].imgSrc;
    			if (dirty & /*variant, cls*/ 3) image_changes.cls = `logo--${/*variants*/ ctx[2][/*variant*/ ctx[0]].class} ${/*cls*/ ctx[1]}`;
    			image.$set(image_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	let { variant = "small" } = $$props;
    	let { cls = "" } = $$props;

    	const variants = {
    		small: {
    			class: "small",
    			imgSrc: "shared/logo.png"
    		},
    		big: {
    			class: "big",
    			imgSrc: "shared/logo_full.png"
    		}
    	};

    	const writable_props = ['variant', 'cls'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('variant' in $$props) $$invalidate(0, variant = $$props.variant);
    		if ('cls' in $$props) $$invalidate(1, cls = $$props.cls);
    	};

    	$$self.$capture_state = () => ({ Image, variant, cls, variants });

    	$$self.$inject_state = $$props => {
    		if ('variant' in $$props) $$invalidate(0, variant = $$props.variant);
    		if ('cls' in $$props) $$invalidate(1, cls = $$props.cls);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [variant, cls, variants];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { variant: 0, cls: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get variant() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cls() {
    		throw new Error("<Logo>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cls(value) {
    		throw new Error("<Logo>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.48.0 */
    const file$k = "src\\pages\\Home.svelte";

    // (13:6) <Link          to="/register"          class="button button--lg button--filled--primary -mx--900"        >
    function create_default_slot_1$5(ctx) {
    	let span1;
    	let span0;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			span0.textContent = "Create an account";
    			attr_dev(span0, "class", "-color--inverted");
    			add_location(span0, file$k, 17, 10, 582);
    			attr_dev(span1, "class", "text__action--button--large");
    			add_location(span1, file$k, 16, 8, 528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(13:6) <Link          to=\\\"/register\\\"          class=\\\"button button--lg button--filled--primary -mx--900\\\"        >",
    		ctx
    	});

    	return block;
    }

    // (21:6) <Link          to="/login"          class="button button--lg button--borderless--neutral -mx--900"        >
    function create_default_slot$9(ctx) {
    	let span1;
    	let span0;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			span0 = element("span");
    			span0.textContent = "Log in";
    			attr_dev(span0, "class", "-color--neutral-3");
    			add_location(span0, file$k, 25, 10, 850);
    			attr_dev(span1, "class", "text__action--button--large");
    			add_location(span1, file$k, 24, 8, 796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, span0);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(21:6) <Link          to=\\\"/login\\\"          class=\\\"button button--lg button--borderless--neutral -mx--900\\\"        >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let stylesheet;
    	let t0;
    	let div1;
    	let header;
    	let logo;
    	let t1;
    	let div0;
    	let link0;
    	let t2;
    	let link1;
    	let t3;
    	let main;
    	let h1;
    	let t5;
    	let image;
    	let current;

    	stylesheet = new Stylesheet({
    			props: { src: "pages/home.css" },
    			$$inline: true
    		});

    	logo = new Logo({
    			props: { variant: "big" },
    			$$inline: true
    		});

    	link0 = new Link$1({
    			props: {
    				to: "/register",
    				class: "button button--lg button--filled--primary -mx--900",
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/login",
    				class: "button button--lg button--borderless--neutral -mx--900",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	image = new Image({
    			props: {
    				src: "home/tomato.jpg",
    				alt: "tomato",
    				cls: "hero_image"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stylesheet.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			header = element("header");
    			create_component(logo.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t2 = space();
    			create_component(link1.$$.fragment);
    			t3 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Manage your pantry with ease";
    			t5 = space();
    			create_component(image.$$.fragment);
    			attr_dev(div0, "class", "-mr--900 -align-center");
    			add_location(div0, file$k, 11, 4, 368);
    			attr_dev(header, "class", "header");
    			add_location(header, file$k, 9, 2, 311);
    			attr_dev(h1, "class", "text__heading--1--light");
    			add_location(h1, file$k, 31, 4, 993);
    			attr_dev(main, "class", "hero_container");
    			add_location(main, file$k, 30, 2, 958);
    			attr_dev(div1, "class", "page");
    			add_location(div1, file$k, 8, 0, 289);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(stylesheet, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, header);
    			mount_component(logo, header, null);
    			append_dev(header, t1);
    			append_dev(header, div0);
    			mount_component(link0, div0, null);
    			append_dev(div0, t2);
    			mount_component(link1, div0, null);
    			append_dev(div1, t3);
    			append_dev(div1, main);
    			append_dev(main, h1);
    			append_dev(main, t5);
    			mount_component(image, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stylesheet.$$.fragment, local);
    			transition_in(logo.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stylesheet.$$.fragment, local);
    			transition_out(logo.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stylesheet, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(logo);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(image);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1, Image, Stylesheet, Logo });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\components\atoms\Icon.svelte generated by Svelte v3.48.0 */

    function create_fragment$l(ctx) {
    	let html_tag;
    	let raw_value = /*svgs*/ ctx[1][/*icon*/ ctx[0]] + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(false);
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*icon*/ 1 && raw_value !== (raw_value = /*svgs*/ ctx[1][/*icon*/ ctx[0]] + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { icon } = $$props;
    	let { cls = "" } = $$props;

    	const svgs = {
    		add: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Content / add"><mask id="mask0_70_7092" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="5" y="5" width="14" height="15"><g id="Icon Mask"><path id="Round" d="M18 13.2646H13V18.2646C13 18.8146 12.55 19.2646 12 19.2646C11.45 19.2646 11 18.8146 11 18.2646V13.2646H6C5.45 13.2646 5 12.8146 5 12.2646C5 11.7146 5.45 11.2646 6 11.2646H11V6.26465C11 5.71465 11.45 5.26465 12 5.26465C12.55 5.26465 13 5.71465 13 6.26465V11.2646H18C18.55 11.2646 19 11.7146 19 12.2646C19 12.8146 18.55 13.2646 18 13.2646Z" fill="black"/></g></mask><g mask="url(#mask0_70_7092)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		arrow_back: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Navigation / arrow back_ios"><mask id="mask0_70_10317" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="6" y="2" width="12" height="20"><g id="Icon Mask"><path id="Round" d="M17.0019 3.24934C16.5119 2.75934 15.7219 2.75934 15.2319 3.24934L6.92189 11.5593C6.53189 11.9493 6.53189 12.5793 6.92189 12.9693L15.2319 21.2793C15.7219 21.7693 16.5119 21.7693 17.0019 21.2793C17.4919 20.7893 17.4919 19.9993 17.0019 19.5093L9.76189 12.2593L17.0119 5.00934C17.4919 4.52934 17.4919 3.72934 17.0019 3.24934Z" fill="black"/></g></mask><g mask="url(#mask0_70_10317)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		arrow_forward: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Navigation / arrow forward"><mask id="mask0_70_10339" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="4" width="16" height="16"><g id="Icon Mask"><path id="Round" d="M5.20874 13.2644H16.3787L11.4987 18.1444C11.1087 18.5344 11.1087 19.1744 11.4987 19.5644C11.8887 19.9544 12.5187 19.9544 12.9087 19.5644L19.4987 12.9744C19.8887 12.5844 19.8887 11.9544 19.4987 11.5644L12.9187 4.96436C12.7319 4.77711 12.4783 4.67188 12.2137 4.67188C11.9492 4.67188 11.6956 4.77711 11.5087 4.96436C11.1187 5.35436 11.1187 5.98436 11.5087 6.37436L16.3787 11.2644H5.20874C4.65874 11.2644 4.20874 11.7144 4.20874 12.2644C4.20874 12.8144 4.65874 13.2644 5.20874 13.2644Z" fill="black"/></g></mask><g mask="url(#mask0_70_10339)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		dashboard: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Action / dashboard"><mask id="mask0_70_4193" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="19"><g id="Icon Mask"><path id="Round" fill-rule="evenodd" clip-rule="evenodd" d="M10 13.2646H4C3.45 13.2646 3 12.8146 3 12.2646V4.26465C3 3.71465 3.45 3.26465 4 3.26465H10C10.55 3.26465 11 3.71465 11 4.26465V12.2646C11 12.8146 10.55 13.2646 10 13.2646ZM10 21.2646H4C3.45 21.2646 3 20.8146 3 20.2646V16.2646C3 15.7146 3.45 15.2646 4 15.2646H10C10.55 15.2646 11 15.7146 11 16.2646V20.2646C11 20.8146 10.55 21.2646 10 21.2646ZM14 21.2646H20C20.55 21.2646 21 20.8146 21 20.2646V12.2646C21 11.7146 20.55 11.2646 20 11.2646H14C13.45 11.2646 13 11.7146 13 12.2646V20.2646C13 20.8146 13.45 21.2646 14 21.2646ZM13 8.26465V4.26465C13 3.71465 13.45 3.26465 14 3.26465H20C20.55 3.26465 21 3.71465 21 4.26465V8.26465C21 8.81465 20.55 9.26465 20 9.26465H14C13.45 9.26465 13 8.81465 13 8.26465Z" fill="black"/></g></mask><g mask="url(#mask0_70_4193)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		paste: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Content / paste"><mask id="mask0_70_7305" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="1" width="18" height="23"><g id="Icon Mask"><path id="Round" fill-rule="evenodd" clip-rule="evenodd" d="M19 3.26465H14.82C14.4 2.10465 13.3 1.26465 12 1.26465C10.7 1.26465 9.6 2.10465 9.18 3.26465H5C3.9 3.26465 3 4.16465 3 5.26465V21.2646C3 22.3646 3.9 23.2646 5 23.2646H19C20.1 23.2646 21 22.3646 21 21.2646V5.26465C21 4.16465 20.1 3.26465 19 3.26465ZM12 3.26465C12.55 3.26465 13 3.71465 13 4.26465C13 4.81465 12.55 5.26465 12 5.26465C11.45 5.26465 11 4.81465 11 4.26465C11 3.71465 11.45 3.26465 12 3.26465ZM5 20.2646C5 20.8146 5.45 21.2646 6 21.2646H18C18.55 21.2646 19 20.8146 19 20.2646V6.26465C19 5.71465 18.55 5.26465 18 5.26465H17V6.26465C17 7.36465 16.1 8.26465 15 8.26465H9C7.9 8.26465 7 7.36465 7 6.26465V5.26465H6C5.45 5.26465 5 5.71465 5 6.26465V20.2646Z" fill="black"/></g></mask><g mask="url(#mask0_70_7305)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		room_service: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Places / room service"><mask id="mask0_70_10999" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="2" y="5" width="20" height="15"><g id="Icon Mask"><path id="Round" fill-rule="evenodd" clip-rule="evenodd" d="M14 7.26465C14 7.54465 13.94 7.81465 13.84 8.05465C17.75 8.86465 20.73 12.1946 21 16.2646H3C3.27 12.1946 6.25 8.86465 10.16 8.05465C10.06 7.81465 10 7.54465 10 7.26465C10 6.16465 10.9 5.26465 12 5.26465C13.1 5.26465 14 6.16465 14 7.26465ZM22 18.2646C22 17.7146 21.55 17.2646 21 17.2646H3C2.45 17.2646 2 17.7146 2 18.2646C2 18.8146 2.45 19.2646 3 19.2646H21C21.55 19.2646 22 18.8146 22 18.2646Z" fill="black"/></g></mask><g mask="url(#mask0_70_10999)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		settings: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Action / settings"><mask id="mask0_70_5007" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="21"><g id="Icon Mask"><path id="Round" fill-rule="evenodd" clip-rule="evenodd" d="M19.5022 12.2646C19.5022 12.6046 19.4722 12.9246 19.4322 13.2446L21.5422 14.8946C21.7322 15.0446 21.7822 15.3146 21.6622 15.5346L19.6622 18.9946C19.5422 19.2146 19.2822 19.3046 19.0522 19.2146L16.5622 18.2146C16.0422 18.6046 15.4822 18.9446 14.8722 19.1946L14.4922 21.8446C14.4622 22.0846 14.2522 22.2646 14.0022 22.2646H10.0022C9.75216 22.2646 9.54216 22.0846 9.51216 21.8446L9.13216 19.1946C8.52216 18.9446 7.96216 18.6146 7.44216 18.2146L4.95216 19.2146C4.73216 19.2946 4.46216 19.2146 4.34216 18.9946L2.34216 15.5346C2.22216 15.3146 2.27216 15.0446 2.46216 14.8946L4.57216 13.2446C4.53216 12.9246 4.50216 12.5946 4.50216 12.2646C4.50216 11.9346 4.53216 11.6046 4.57216 11.2846L2.46216 9.63465C2.27216 9.48465 2.21216 9.21465 2.34216 8.99465L4.34216 5.53465C4.46216 5.31465 4.72216 5.22465 4.95216 5.31465L7.44216 6.31465C7.96216 5.92465 8.52216 5.58465 9.13216 5.33465L9.51216 2.68465C9.54216 2.44465 9.75216 2.26465 10.0022 2.26465H14.0022C14.2522 2.26465 14.4622 2.44465 14.4922 2.68465L14.8722 5.33465C15.4822 5.58465 16.0422 5.91465 16.5622 6.31465L19.0522 5.31465C19.2722 5.23465 19.5422 5.31465 19.6622 5.53465L21.6622 8.99465C21.7822 9.21465 21.7322 9.48465 21.5422 9.63465L19.4322 11.2846C19.4722 11.6046 19.5022 11.9246 19.5022 12.2646ZM8.50216 12.2646C8.50216 14.1946 10.0722 15.7646 12.0022 15.7646C13.9322 15.7646 15.5022 14.1946 15.5022 12.2646C15.5022 10.3346 13.9322 8.76465 12.0022 8.76465C10.0722 8.76465 8.50216 10.3346 8.50216 12.2646Z" fill="black"/></g></mask><g mask="url(#mask0_70_5007)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		clear: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Content / clear"><mask id="mask0_70_7154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="5" y="5" width="14" height="14"><g id="Icon Mask"><path id="Round" d="M18.3 5.97436C18.1131 5.78711 17.8595 5.68187 17.595 5.68187C17.3305 5.68187 17.0768 5.78711 16.89 5.97436L12 10.8544L7.10997 5.96436C6.92314 5.77711 6.66949 5.67188 6.40497 5.67188C6.14045 5.67188 5.8868 5.77711 5.69997 5.96436C5.30997 6.35436 5.30997 6.98436 5.69997 7.37436L10.59 12.2644L5.69997 17.1544C5.30997 17.5444 5.30997 18.1744 5.69997 18.5644C6.08997 18.9544 6.71997 18.9544 7.10997 18.5644L12 13.6744L16.89 18.5644C17.28 18.9544 17.91 18.9544 18.3 18.5644C18.69 18.1744 18.69 17.5444 18.3 17.1544L13.41 12.2644L18.3 7.37436C18.68 6.99436 18.68 6.35436 18.3 5.97436Z" fill="black"/></g></mask><g mask="url(#mask0_70_7154)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`,
    		trash_bin: `<svg class="${cls}" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Action / delete"><mask id="mask0_70_4210" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="5" y="3" width="14" height="19"><g id="Icon Mask"><path id="Round" fill-rule="evenodd" clip-rule="evenodd" d="M15.5 4.26465H18C18.55 4.26465 19 4.71465 19 5.26465C19 5.81465 18.55 6.26465 18 6.26465H6C5.45 6.26465 5 5.81465 5 5.26465C5 4.71465 5.45 4.26465 6 4.26465H8.5L9.21 3.55465C9.39 3.37465 9.65 3.26465 9.91 3.26465H14.09C14.35 3.26465 14.61 3.37465 14.79 3.55465L15.5 4.26465ZM8 21.2646C6.9 21.2646 6 20.3646 6 19.2646V9.26465C6 8.16465 6.9 7.26465 8 7.26465H16C17.1 7.26465 18 8.16465 18 9.26465V19.2646C18 20.3646 17.1 21.2646 16 21.2646H8Z" fill="black"/></g></mask><g mask="url(#mask0_70_4210)"><rect id="Color Fill" y="0.264648" width="24" height="24" fill="#858C94"/></g></g></svg>`
    	};

    	const writable_props = ['icon', 'cls'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('cls' in $$props) $$invalidate(2, cls = $$props.cls);
    	};

    	$$self.$capture_state = () => ({ icon, cls, svgs });

    	$$self.$inject_state = $$props => {
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('cls' in $$props) $$invalidate(2, cls = $$props.cls);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon, svgs, cls];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { icon: 0, cls: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !('icon' in props)) {
    			console.warn("<Icon> was created without expected prop 'icon'");
    		}
    	}

    	get icon() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cls() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cls(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\Button.svelte generated by Svelte v3.48.0 */

    const file$j = "src\\components\\molecules\\Button.svelte";
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});

    // (21:2) {#if $$slots.content}
    function create_if_block_1$1(ctx) {
    	let span;
    	let span_class_value;
    	let current;
    	const content_slot_template = /*#slots*/ ctx[9].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[8], get_content_slot_context);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (content_slot) content_slot.c();
    			attr_dev(span, "class", span_class_value = `text__action--button--${/*buttonSizeToTextSize*/ ctx[6][/*size*/ ctx[2]]}`);
    			add_location(span, file$j, 21, 4, 428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (content_slot) {
    				content_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[8], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*size*/ 4 && span_class_value !== (span_class_value = `text__action--button--${/*buttonSizeToTextSize*/ ctx[6][/*size*/ ctx[2]]}`)) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (content_slot) content_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(21:2) {#if $$slots.content}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#if $$slots.icon}
    function create_if_block$5(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[9].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[8], get_icon_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (icon_slot) icon_slot.c();
    			attr_dev(div, "class", div_class_value = `-inline-flex ${/*$$slots*/ ctx[7].content ? "-pl--500" : ""} -mt--200`);
    			add_location(div, file$j, 26, 4, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (icon_slot) {
    				icon_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[8], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*$$slots*/ 128 && div_class_value !== (div_class_value = `-inline-flex ${/*$$slots*/ ctx[7].content ? "-pl--500" : ""} -mt--200`)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (icon_slot) icon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(26:2) {#if $$slots.icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$$slots*/ ctx[7].content && create_if_block_1$1(ctx);
    	let if_block1 = /*$$slots*/ ctx[7].icon && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(button, "type", /*type*/ ctx[0]);
    			attr_dev(button, "class", button_class_value = `${/*cls*/ ctx[1]} button button--${/*size*/ ctx[2]}${/*squared*/ ctx[3] ? "--squared" : ""} button--${/*fill*/ ctx[4]}--${/*color*/ ctx[5]}`);
    			add_location(button, file$j, 13, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block0) if_block0.m(button, null);
    			append_dev(button, t);
    			if (if_block1) if_block1.m(button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$$slots*/ ctx[7].content) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 128) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(button, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$$slots*/ ctx[7].icon) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 128) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(button, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*type*/ 1) {
    				attr_dev(button, "type", /*type*/ ctx[0]);
    			}

    			if (!current || dirty & /*cls, size, squared, fill, color*/ 62 && button_class_value !== (button_class_value = `${/*cls*/ ctx[1]} button button--${/*size*/ ctx[2]}${/*squared*/ ctx[3] ? "--squared" : ""} button--${/*fill*/ ctx[4]}--${/*color*/ ctx[5]}`)) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['content','icon']);
    	const $$slots = compute_slots(slots);
    	let { type = "button" } = $$props;
    	let { cls = "" } = $$props;
    	let { size } = $$props;
    	let { squared = false } = $$props;
    	let { fill } = $$props;
    	let { color } = $$props;
    	const buttonSizeToTextSize = { sm: "small", md: "medium", lg: "large" };
    	const writable_props = ['type', 'cls', 'size', 'squared', 'fill', 'color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('cls' in $$props) $$invalidate(1, cls = $$props.cls);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('squared' in $$props) $$invalidate(3, squared = $$props.squared);
    		if ('fill' in $$props) $$invalidate(4, fill = $$props.fill);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		cls,
    		size,
    		squared,
    		fill,
    		color,
    		buttonSizeToTextSize
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('cls' in $$props) $$invalidate(1, cls = $$props.cls);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('squared' in $$props) $$invalidate(3, squared = $$props.squared);
    		if ('fill' in $$props) $$invalidate(4, fill = $$props.fill);
    		if ('color' in $$props) $$invalidate(5, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		type,
    		cls,
    		size,
    		squared,
    		fill,
    		color,
    		buttonSizeToTextSize,
    		$$slots,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			type: 0,
    			cls: 1,
    			size: 2,
    			squared: 3,
    			fill: 4,
    			color: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*size*/ ctx[2] === undefined && !('size' in props)) {
    			console.warn("<Button> was created without expected prop 'size'");
    		}

    		if (/*fill*/ ctx[4] === undefined && !('fill' in props)) {
    			console.warn("<Button> was created without expected prop 'fill'");
    		}

    		if (/*color*/ ctx[5] === undefined && !('color' in props)) {
    			console.warn("<Button> was created without expected prop 'color'");
    		}
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cls() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cls(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get squared() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set squared(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\Tab.svelte generated by Svelte v3.48.0 */

    const file$i = "src\\components\\molecules\\Tab.svelte";

    function create_fragment$j(ctx) {
    	let a;
    	let span1;
    	let span0;
    	let a_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			a = element("a");
    			span1 = element("span");
    			span0 = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span0, "class", "-color--neutral_3");
    			add_location(span0, file$i, 6, 4, 215);
    			attr_dev(span1, "class", "text__action--button--medium");
    			add_location(span1, file$i, 5, 2, 166);
    			attr_dev(a, "href", /*to*/ ctx[0]);

    			attr_dev(a, "class", a_class_value = `tab ${/*pathname*/ ctx[1].includes(/*to*/ ctx[0])
			? "tab--active"
			: ""}`);

    			add_location(a, file$i, 4, 0, 89);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span1);
    			append_dev(span1, span0);

    			if (default_slot) {
    				default_slot.m(span0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*to*/ 1) {
    				attr_dev(a, "href", /*to*/ ctx[0]);
    			}

    			if (!current || dirty & /*to*/ 1 && a_class_value !== (a_class_value = `tab ${/*pathname*/ ctx[1].includes(/*to*/ ctx[0])
			? "tab--active"
			: ""}`)) {
    				attr_dev(a, "class", a_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	let { to } = $$props;
    	let pathname = window.location.pathname;
    	const writable_props = ['to'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ to, pathname });

    	$$self.$inject_state = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('pathname' in $$props) $$invalidate(1, pathname = $$props.pathname);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [to, pathname, $$scope, slots];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { to: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[0] === undefined && !('to' in props)) {
    			console.warn("<Tab> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\ErrorMessage.svelte generated by Svelte v3.48.0 */
    const file$h = "src\\components\\molecules\\ErrorMessage.svelte";

    // (5:0) {#if isString(error)}
    function create_if_block$4(ctx) {
    	let div;
    	let span1;
    	let span0;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span1 = element("span");
    			span0 = element("span");
    			t = text(/*error*/ ctx[0]);
    			attr_dev(span0, "class", "-color--state_error");
    			add_location(span0, file$h, 7, 6, 222);
    			attr_dev(span1, "class", "text__paragraph--small--regular");
    			add_location(span1, file$h, 6, 4, 168);
    			attr_dev(div, "class", "-pl--700 -mt--400 ");
    			add_location(div, file$h, 5, 2, 130);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span1);
    			append_dev(span1, span0);
    			append_dev(span0, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*error*/ 1) set_data_dev(t, /*error*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(5:0) {#if isString(error)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let show_if = isString(/*error*/ ctx[0]);
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*error*/ 1) show_if = isString(/*error*/ ctx[0]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ErrorMessage', slots, []);
    	let { error = null } = $$props;
    	const writable_props = ['error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ErrorMessage> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({ isString, error });

    	$$self.$inject_state = $$props => {
    		if ('error' in $$props) $$invalidate(0, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [error];
    }

    class ErrorMessage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { error: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ErrorMessage",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get error() {
    		throw new Error("<ErrorMessage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<ErrorMessage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\InputLabel.svelte generated by Svelte v3.48.0 */
    const file$g = "src\\components\\molecules\\InputLabel.svelte";

    // (10:4) {#if !isNil(label)}
    function create_if_block$3(ctx) {
    	let div;
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t = text(/*label*/ ctx[0]);
    			attr_dev(span, "class", "text__paragraph--base--heavy");
    			add_location(span, file$g, 11, 8, 388);
    			attr_dev(div, "class", "-pl--700 -pb--500");
    			add_location(div, file$g, 10, 6, 347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 1) set_data_dev(t, /*label*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(10:4) {#if !isNil(label)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let label_1;
    	let show_if = !isNil(/*label*/ ctx[0]);
    	let t0;
    	let t1;
    	let errormessage;
    	let current;
    	let if_block = show_if && create_if_block$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	errormessage = new ErrorMessage({
    			props: { error: /*error*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			label_1 = element("label");
    			if (if_block) if_block.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			create_component(errormessage.$$.fragment);
    			attr_dev(label_1, "class", "input__label -full-width");
    			add_location(label_1, file$g, 8, 2, 274);
    			attr_dev(div, "class", "input -full-width");
    			add_location(div, file$g, 6, 0, 179);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label_1);
    			if (if_block) if_block.m(label_1, null);
    			append_dev(label_1, t0);

    			if (default_slot) {
    				default_slot.m(label_1, null);
    			}

    			append_dev(label_1, t1);
    			mount_component(errormessage, label_1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 1) show_if = !isNil(/*label*/ ctx[0]);

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(label_1, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			const errormessage_changes = {};
    			if (dirty & /*error*/ 2) errormessage_changes.error = /*error*/ ctx[1];
    			errormessage.$set(errormessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(errormessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(errormessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(errormessage);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InputLabel', slots, ['default']);
    	let { label = null } = $$props;
    	let { error = null } = $$props;
    	const writable_props = ['label', 'error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InputLabel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ isNil, ErrorMessage, label, error });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, error, $$scope, slots];
    }

    class InputLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { label: 0, error: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputLabel",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get label() {
    		throw new Error("<InputLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<InputLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<InputLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<InputLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\TextInput.svelte generated by Svelte v3.48.0 */
    const file$f = "src\\components\\molecules\\TextInput.svelte";

    // (11:0) <InputLabel {label} {error}>
    function create_default_slot$8(ctx) {
    	let input;
    	let input_class_value;
    	let input_placeholder_value;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "name", /*name*/ ctx[1]);
    			attr_dev(input, "type", /*type*/ ctx[2]);

    			attr_dev(input, "class", input_class_value = `input__input -full-width ${/*ghost*/ ctx[6]
			? "input__input--ghost -bg--neutral_8"
			: ""} ${/*cls*/ ctx[5]}`);

    			attr_dev(input, "placeholder", input_placeholder_value = `${/*placeholder*/ ctx[4] ?? /*label*/ ctx[0] ?? /*name*/ ctx[1]}...`);
    			add_location(input, file$f, 11, 2, 288);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) {
    				attr_dev(input, "name", /*name*/ ctx[1]);
    			}

    			if (dirty & /*type*/ 4) {
    				attr_dev(input, "type", /*type*/ ctx[2]);
    			}

    			if (dirty & /*ghost, cls*/ 96 && input_class_value !== (input_class_value = `input__input -full-width ${/*ghost*/ ctx[6]
			? "input__input--ghost -bg--neutral_8"
			: ""} ${/*cls*/ ctx[5]}`)) {
    				attr_dev(input, "class", input_class_value);
    			}

    			if (dirty & /*placeholder, label, name*/ 19 && input_placeholder_value !== (input_placeholder_value = `${/*placeholder*/ ctx[4] ?? /*label*/ ctx[0] ?? /*name*/ ctx[1]}...`)) {
    				attr_dev(input, "placeholder", input_placeholder_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(11:0) <InputLabel {label} {error}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let inputlabel;
    	let current;

    	inputlabel = new InputLabel({
    			props: {
    				label: /*label*/ ctx[0],
    				error: /*error*/ ctx[3],
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(inputlabel.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputlabel, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const inputlabel_changes = {};
    			if (dirty & /*label*/ 1) inputlabel_changes.label = /*label*/ ctx[0];
    			if (dirty & /*error*/ 8) inputlabel_changes.error = /*error*/ ctx[3];

    			if (dirty & /*$$scope, name, type, ghost, cls, placeholder, label*/ 247) {
    				inputlabel_changes.$$scope = { dirty, ctx };
    			}

    			inputlabel.$set(inputlabel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputlabel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputlabel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputlabel, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextInput', slots, []);
    	let { label = null } = $$props;
    	let { name } = $$props;
    	let { type = "text" } = $$props;
    	let { error = null } = $$props;
    	let { placeholder = null } = $$props;
    	let { cls = "" } = $$props;
    	let { ghost = false } = $$props;
    	const writable_props = ['label', 'name', 'type', 'error', 'placeholder', 'cls', 'ghost'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('error' in $$props) $$invalidate(3, error = $$props.error);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('cls' in $$props) $$invalidate(5, cls = $$props.cls);
    		if ('ghost' in $$props) $$invalidate(6, ghost = $$props.ghost);
    	};

    	$$self.$capture_state = () => ({
    		InputLabel,
    		label,
    		name,
    		type,
    		error,
    		placeholder,
    		cls,
    		ghost
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('error' in $$props) $$invalidate(3, error = $$props.error);
    		if ('placeholder' in $$props) $$invalidate(4, placeholder = $$props.placeholder);
    		if ('cls' in $$props) $$invalidate(5, cls = $$props.cls);
    		if ('ghost' in $$props) $$invalidate(6, ghost = $$props.ghost);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, name, type, error, placeholder, cls, ghost];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			label: 0,
    			name: 1,
    			type: 2,
    			error: 3,
    			placeholder: 4,
    			cls: 5,
    			ghost: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$g.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[1] === undefined && !('name' in props)) {
    			console.warn("<TextInput> was created without expected prop 'name'");
    		}
    	}

    	get label() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cls() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cls(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ghost() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ghost(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const withFormData = (fn) => (e) => {
        const target = e.target;
        if (target instanceof HTMLFormElement) {
            fn(new FormData(target));
        }
    };
    const mergeFieldErrors = (current, newErrors) => {
        if (isNil(newErrors)) {
            return Object.fromEntries(Object.entries(current).map(([errorName]) => [errorName, null]));
        }
        return Object.assign(Object.assign({}, current), newErrors);
    };
    const setInitialValues = (ref, initialValues) => {
        const inputValues = Object.entries(initialValues);
        inputValues.forEach(([inputName, value]) => {
            const selector = `[name="${inputName}"]`;
            const input = ref.querySelector(selector);
            if (isNil(input)) {
                return;
            }
            if (input instanceof HTMLInputElement) {
                if (input.type === 'radio') {
                    [...ref.querySelectorAll(selector)].forEach((radio) => {
                        if (radio.value === value) {
                            radio.checked = true;
                        }
                        else {
                            radio.checked = false;
                        }
                    });
                }
                else {
                    input.value = value;
                }
            }
            if (input instanceof HTMLTextAreaElement) {
                input.value = value;
            }
        });
    };

    /* src\pages\Auth.svelte generated by Svelte v3.48.0 */
    const file$e = "src\\pages\\Auth.svelte";

    // (86:6) <Tab to="/login">
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Log in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(86:6) <Tab to=\\\"/login\\\">",
    		ctx
    	});

    	return block;
    }

    // (87:6) <Tab to="/register">
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Register");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(87:6) <Tab to=\\\"/register\\\">",
    		ctx
    	});

    	return block;
    }

    // (119:48) 
    function create_if_block_1(ctx) {
    	let form;
    	let div;
    	let textinput0;
    	let t0;
    	let textinput1;
    	let t1;
    	let textinput2;
    	let t2;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	textinput0 = new TextInput({
    			props: {
    				name: "email",
    				label: "Email",
    				error: /*fieldErrors*/ ctx[0].email
    			},
    			$$inline: true
    		});

    	textinput1 = new TextInput({
    			props: {
    				name: "password",
    				label: "Password",
    				type: "password",
    				error: /*fieldErrors*/ ctx[0].password
    			},
    			$$inline: true
    		});

    	textinput2 = new TextInput({
    			props: {
    				name: "repeated_password",
    				label: "Repeat password",
    				placeholder: "Password",
    				type: "password",
    				error: /*fieldErrors*/ ctx[0].repeatedPassword
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				type: "submit",
    				cls: "-mt--1000 -full-width -justify-center",
    				size: "lg",
    				color: "primary",
    				fill: "filled",
    				$$slots: {
    					icon: [create_icon_slot_1$1],
    					content: [create_content_slot_1$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div = element("div");
    			create_component(textinput0.$$.fragment);
    			t0 = space();
    			create_component(textinput1.$$.fragment);
    			t1 = space();
    			create_component(textinput2.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "form__inputs_container");
    			add_location(div, file$e, 123, 8, 4113);
    			attr_dev(form, "class", "form -full-width -mt--1000");
    			add_location(form, file$e, 119, 6, 3978);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div);
    			mount_component(textinput0, div, null);
    			append_dev(div, t0);
    			mount_component(textinput1, div, null);
    			append_dev(div, t1);
    			mount_component(textinput2, div, null);
    			append_dev(form, t2);
    			mount_component(button, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(withFormData(/*onRegisterSubmit*/ ctx[3])), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};
    			if (dirty & /*fieldErrors*/ 1) textinput0_changes.error = /*fieldErrors*/ ctx[0].email;
    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};
    			if (dirty & /*fieldErrors*/ 1) textinput1_changes.error = /*fieldErrors*/ ctx[0].password;
    			textinput1.$set(textinput1_changes);
    			const textinput2_changes = {};
    			if (dirty & /*fieldErrors*/ 1) textinput2_changes.error = /*fieldErrors*/ ctx[0].repeatedPassword;
    			textinput2.$set(textinput2_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(textinput2.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(textinput2.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(textinput0);
    			destroy_component(textinput1);
    			destroy_component(textinput2);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(119:48) ",
    		ctx
    	});

    	return block;
    }

    // (89:4) {#if pathname.includes(forms.login)}
    function create_if_block$2(ctx) {
    	let form;
    	let div;
    	let textinput0;
    	let t0;
    	let textinput1;
    	let t1;
    	let link;
    	let t2;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	textinput0 = new TextInput({
    			props: {
    				name: "email",
    				label: "Email",
    				error: /*fieldErrors*/ ctx[0].email
    			},
    			$$inline: true
    		});

    	textinput1 = new TextInput({
    			props: {
    				name: "password",
    				label: "Password",
    				type: "password",
    				error: /*fieldErrors*/ ctx[0].password
    			},
    			$$inline: true
    		});

    	link = new Link$1({
    			props: {
    				to: "#",
    				class: "text__action--link--small -mt--600 -ml--auto",
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				type: "submit",
    				cls: "-mt--1000 -full-width -justify-center",
    				size: "lg",
    				color: "primary",
    				fill: "filled",
    				$$slots: {
    					icon: [create_icon_slot$2],
    					content: [create_content_slot$3]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div = element("div");
    			create_component(textinput0.$$.fragment);
    			t0 = space();
    			create_component(textinput1.$$.fragment);
    			t1 = space();
    			create_component(link.$$.fragment);
    			t2 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div, "class", "form__inputs_container");
    			add_location(div, file$e, 93, 8, 3022);
    			attr_dev(form, "class", "form -full-width -mt--1000");
    			add_location(form, file$e, 89, 6, 2890);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div);
    			mount_component(textinput0, div, null);
    			append_dev(div, t0);
    			mount_component(textinput1, div, null);
    			append_dev(form, t1);
    			mount_component(link, form, null);
    			append_dev(form, t2);
    			mount_component(button, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(withFormData(/*onLoginSubmit*/ ctx[2])), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};
    			if (dirty & /*fieldErrors*/ 1) textinput0_changes.error = /*fieldErrors*/ ctx[0].email;
    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};
    			if (dirty & /*fieldErrors*/ 1) textinput1_changes.error = /*fieldErrors*/ ctx[0].password;
    			textinput1.$set(textinput1_changes);
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(textinput0);
    			destroy_component(textinput1);
    			destroy_component(link);
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(89:4) {#if pathname.includes(forms.login)}",
    		ctx
    	});

    	return block;
    }

    // (147:10) 
    function create_content_slot_1$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Sign up";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--inverted");
    			add_location(span, file$e, 146, 10, 4828);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot_1$2.name,
    		type: "slot",
    		source: "(147:10) ",
    		ctx
    	});

    	return block;
    }

    // (148:10) 
    function create_icon_slot_1$1(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				cls: "-fill--inverted",
    				icon: "arrow_forward"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex -pl--500 -mt--200");
    			add_location(div, file$e, 147, 10, 4900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_1$1.name,
    		type: "slot",
    		source: "(148:10) ",
    		ctx
    	});

    	return block;
    }

    // (103:8) <Link to="#" class="text__action--link--small -mt--600 -ml--auto">
    function create_default_slot$7(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Forgot password?";
    			attr_dev(span, "class", "-color--action_default");
    			add_location(span, file$e, 103, 10, 3406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(103:8) <Link to=\\\"#\\\" class=\\\"text__action--link--small -mt--600 -ml--auto\\\">",
    		ctx
    	});

    	return block;
    }

    // (113:10) 
    function create_content_slot$3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Log in";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--inverted");
    			add_location(span, file$e, 112, 10, 3676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$3.name,
    		type: "slot",
    		source: "(113:10) ",
    		ctx
    	});

    	return block;
    }

    // (114:10) 
    function create_icon_slot$2(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				cls: "-fill--inverted",
    				icon: "arrow_forward"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex -pl--500 -mt--200");
    			add_location(div, file$e, 113, 10, 3747);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot$2.name,
    		type: "slot",
    		source: "(114:10) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let stylesheet;
    	let t0;
    	let main;
    	let logo;
    	let t1;
    	let div1;
    	let div0;
    	let tab0;
    	let t2;
    	let tab1;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let t4;
    	let div2;
    	let image0;
    	let t5;
    	let image1;
    	let t6;
    	let image2;
    	let current;

    	stylesheet = new Stylesheet({
    			props: { src: "pages/auth.css" },
    			$$inline: true
    		});

    	logo = new Logo({
    			props: { variant: "big" },
    			$$inline: true
    		});

    	tab0 = new Tab({
    			props: {
    				to: "/login",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				to: "/register",
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$2, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*pathname*/ ctx[4].includes(/*forms*/ ctx[1].login)) return 0;
    		if (/*pathname*/ ctx[4].includes(/*forms*/ ctx[1].register)) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	image0 = new Image({
    			props: {
    				src: "auth/onion.jpg",
    				alt: "onion",
    				cls: "bg_photo bg_photo--right"
    			},
    			$$inline: true
    		});

    	image1 = new Image({
    			props: {
    				src: "auth/broccoli.jpg",
    				alt: "broccoli",
    				cls: "bg_photo bg_photo--top"
    			},
    			$$inline: true
    		});

    	image2 = new Image({
    			props: {
    				src: "auth/garlic.jpg",
    				alt: "garlic",
    				cls: "bg_photo bg_photo--left"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stylesheet.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(logo.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(tab0.$$.fragment);
    			t2 = space();
    			create_component(tab1.$$.fragment);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			div2 = element("div");
    			create_component(image0.$$.fragment);
    			t5 = space();
    			create_component(image1.$$.fragment);
    			t6 = space();
    			create_component(image2.$$.fragment);
    			attr_dev(div0, "class", "tabs_container");
    			add_location(div0, file$e, 84, 4, 2721);
    			attr_dev(div1, "class", "page_content");
    			add_location(div1, file$e, 83, 2, 2689);
    			attr_dev(main, "class", "page");
    			add_location(main, file$e, 81, 0, 2640);
    			attr_dev(div2, "class", "bg_photos_container");
    			add_location(div2, file$e, 155, 0, 5105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(stylesheet, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(logo, main, null);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			mount_component(tab0, div0, null);
    			append_dev(div0, t2);
    			mount_component(tab1, div0, null);
    			append_dev(div1, t3);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(image0, div2, null);
    			append_dev(div2, t5);
    			mount_component(image1, div2, null);
    			append_dev(div2, t6);
    			mount_component(image2, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stylesheet.$$.fragment, local);
    			transition_in(logo.$$.fragment, local);
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(image0.$$.fragment, local);
    			transition_in(image1.$$.fragment, local);
    			transition_in(image2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stylesheet.$$.fragment, local);
    			transition_out(logo.$$.fragment, local);
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(image0.$$.fragment, local);
    			transition_out(image1.$$.fragment, local);
    			transition_out(image2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stylesheet, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(logo);
    			destroy_component(tab0);
    			destroy_component(tab1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			destroy_component(image0);
    			destroy_component(image1);
    			destroy_component(image2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Auth', slots, []);
    	const services = getServices();
    	const navigate = useNavigate();

    	const forms = {
    		login: Routes.login,
    		register: Routes.register
    	};

    	let fieldErrors = {
    		email: null,
    		password: null,
    		repeatedPassword: null
    	};

    	let updateFieldErrors = newErrors => {
    		$$invalidate(0, fieldErrors = mergeFieldErrors(fieldErrors, newErrors));
    	};

    	let onLoginSubmit = data => {
    		const email = data.get("email");
    		const password = data.get("password");
    		const localValidationResult = services.validation.validateLoginFields({ email, password });

    		if (!localValidationResult.isValid || isNil(localValidationResult.validFields)) {
    			return updateFieldErrors(localValidationResult.errors);
    		} else {
    			updateFieldErrors(null);
    		}

    		services.auth.login(localValidationResult.validFields).then(response => {
    			if (!response.ok) {
    				updateFieldErrors(response.errors);
    			} else {
    				navigate(Routes.pantry);
    			}
    		});
    	};

    	let onRegisterSubmit = data => {
    		const email = data.get("email");
    		const password = data.get("password");
    		const repeatedPassword = data.get("repeated_password");
    		const localValidationResult = services.validation.validateRegisterFields({ email, password, repeatedPassword });

    		if (!localValidationResult.isValid || isNil(localValidationResult.validFields)) {
    			return updateFieldErrors(localValidationResult.errors);
    		} else {
    			updateFieldErrors(null);
    		}

    		services.auth.register(localValidationResult.validFields).then(response => {
    			if (!response.ok) {
    				updateFieldErrors(response.errors);
    			} else {
    				navigate(Routes.pantry);
    			}
    		});
    	};

    	let pathname = window.location.pathname;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Auth> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		useNavigate,
    		Icon,
    		Image,
    		Stylesheet,
    		Button,
    		Logo,
    		Tab,
    		TextInput,
    		Routes,
    		getServices,
    		mergeFieldErrors,
    		withFormData,
    		isNil,
    		services,
    		navigate,
    		forms,
    		fieldErrors,
    		updateFieldErrors,
    		onLoginSubmit,
    		onRegisterSubmit,
    		pathname
    	});

    	$$self.$inject_state = $$props => {
    		if ('fieldErrors' in $$props) $$invalidate(0, fieldErrors = $$props.fieldErrors);
    		if ('updateFieldErrors' in $$props) updateFieldErrors = $$props.updateFieldErrors;
    		if ('onLoginSubmit' in $$props) $$invalidate(2, onLoginSubmit = $$props.onLoginSubmit);
    		if ('onRegisterSubmit' in $$props) $$invalidate(3, onRegisterSubmit = $$props.onRegisterSubmit);
    		if ('pathname' in $$props) $$invalidate(4, pathname = $$props.pathname);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [fieldErrors, forms, onLoginSubmit, onRegisterSubmit, pathname];
    }

    class Auth extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Auth",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\atoms\Spinner.svelte generated by Svelte v3.48.0 */

    const file$d = "src\\components\\atoms\\Spinner.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = `spinner spinner-${/*variant*/ ctx[0]}`);
    			add_location(div, file$d, 3, 0, 64);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*variant*/ 1 && div_class_value !== (div_class_value = `spinner spinner-${/*variant*/ ctx[0]}`)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	let { variant = "regular" } = $$props;
    	const writable_props = ['variant'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('variant' in $$props) $$invalidate(0, variant = $$props.variant);
    	};

    	$$self.$capture_state = () => ({ variant });

    	$$self.$inject_state = $$props => {
    		if ('variant' in $$props) $$invalidate(0, variant = $$props.variant);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [variant];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { variant: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get variant() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\Loading.svelte generated by Svelte v3.48.0 */
    const file$c = "src\\components\\molecules\\Loading.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(spinner.$$.fragment);
    			attr_dev(div, "class", "-full-width -full-height");
    			add_location(div, file$c, 4, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(spinner, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(spinner);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Loading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Loading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Spinner });
    	return [];
    }

    class Loading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Loading",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\molecules\NavLink.svelte generated by Svelte v3.48.0 */
    const file$b = "src\\components\\molecules\\NavLink.svelte";

    // (9:2) <Link {to} class="nav__link text__action--button--medium -full-width">
    function create_default_slot$6(ctx) {
    	let icon_1;
    	let t;
    	let span;
    	let current;

    	icon_1 = new Icon({
    			props: {
    				icon: /*icon*/ ctx[1],
    				cls: /*active*/ ctx[2]
    				? "-fill--neutral_black"
    				: "-fill--neutral_6"
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    			t = space();
    			span = element("span");
    			if (default_slot) default_slot.c();

    			attr_dev(span, "class", /*active*/ ctx[2]
    			? "-color--neutral_2"
    			: "-color--neutral_5");

    			add_location(span, file$b, 10, 4, 423);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty & /*icon*/ 2) icon_1_changes.icon = /*icon*/ ctx[1];
    			icon_1.$set(icon_1_changes);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(9:2) <Link {to} class=\\\"nav__link text__action--button--medium -full-width\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let li;
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				to: /*to*/ ctx[0],
    				class: "nav__link text__action--button--medium -full-width",
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			attr_dev(li, "class", `nav__item ${/*active*/ ctx[2] ? "nav__item--active" : ""}`);
    			add_location(li, file$b, 7, 0, 202);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};
    			if (dirty & /*to*/ 1) link_changes.to = /*to*/ ctx[0];

    			if (dirty & /*$$scope, icon*/ 18) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavLink', slots, ['default']);
    	let { to } = $$props;
    	let { icon } = $$props;
    	let active = window.location.pathname.includes(to);
    	const writable_props = ['to', 'icon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavLink> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Link: Link$1, Icon, to, icon, active });

    	$$self.$inject_state = $$props => {
    		if ('to' in $$props) $$invalidate(0, to = $$props.to);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [to, icon, active, slots, $$scope];
    }

    class NavLink extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { to: 0, icon: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavLink",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[0] === undefined && !('to' in props)) {
    			console.warn("<NavLink> was created without expected prop 'to'");
    		}

    		if (/*icon*/ ctx[1] === undefined && !('icon' in props)) {
    			console.warn("<NavLink> was created without expected prop 'icon'");
    		}
    	}

    	get to() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<NavLink>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<NavLink>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\organisms\Nav.svelte generated by Svelte v3.48.0 */
    const file$a = "src\\components\\organisms\\Nav.svelte";

    // (13:6) <NavLink to={Routes.pantry} icon="dashboard">
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Pantry");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(13:6) <NavLink to={Routes.pantry} icon=\\\"dashboard\\\">",
    		ctx
    	});

    	return block;
    }

    // (14:6) <NavLink to="#" icon="room_service">
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Recipes");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(14:6) <NavLink to=\\\"#\\\" icon=\\\"room_service\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:6) <NavLink to="#" icon="paste">
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("To-buy list");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(15:6) <NavLink to=\\\"#\\\" icon=\\\"paste\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:6) <NavLink to="#" icon="settings">
    function create_default_slot$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Settings");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(18:6) <NavLink to=\\\"#\\\" icon=\\\"settings\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let nav;
    	let div0;
    	let logo;
    	let t0;
    	let ul0;
    	let navlink0;
    	let t1;
    	let navlink1;
    	let t2;
    	let navlink2;
    	let t3;
    	let ul1;
    	let navlink3;
    	let t4;
    	let li;
    	let button;
    	let icon;
    	let t5;
    	let span;
    	let t7;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;

    	logo = new Logo({
    			props: {
    				variant: "small",
    				cls: "nav__logo -pt--600 -pl--600 -mt--500 -ml--500"
    			},
    			$$inline: true
    		});

    	navlink0 = new NavLink({
    			props: {
    				to: Routes.pantry,
    				icon: "dashboard",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink1 = new NavLink({
    			props: {
    				to: "#",
    				icon: "room_service",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink2 = new NavLink({
    			props: {
    				to: "#",
    				icon: "paste",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	navlink3 = new NavLink({
    			props: {
    				to: "#",
    				icon: "settings",
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	icon = new Icon({
    			props: {
    				icon: "arrow_back",
    				cls: "-fill--neutral_6"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div0 = element("div");
    			create_component(logo.$$.fragment);
    			t0 = space();
    			ul0 = element("ul");
    			create_component(navlink0.$$.fragment);
    			t1 = space();
    			create_component(navlink1.$$.fragment);
    			t2 = space();
    			create_component(navlink2.$$.fragment);
    			t3 = space();
    			ul1 = element("ul");
    			create_component(navlink3.$$.fragment);
    			t4 = space();
    			li = element("li");
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t5 = space();
    			span = element("span");
    			span.textContent = "Log out";
    			t7 = space();
    			div1 = element("div");
    			attr_dev(ul0, "class", "nav__items");
    			add_location(ul0, file$a, 11, 4, 426);
    			attr_dev(span, "class", "-color--neutral_5");
    			add_location(span, file$a, 24, 10, 998);
    			attr_dev(button, "class", "nav__link text__action--button--medium -full-width");
    			add_location(button, file$a, 19, 8, 794);
    			attr_dev(li, "class", "nav__item");
    			add_location(li, file$a, 18, 6, 762);
    			attr_dev(ul1, "class", "nav__items -mt--auto -mb--900");
    			add_location(ul1, file$a, 16, 4, 654);
    			attr_dev(div0, "class", "nav__content");
    			add_location(div0, file$a, 9, 2, 312);
    			attr_dev(div1, "class", "divider--vertical -full-height -ml--auto");
    			add_location(div1, file$a, 29, 2, 1103);
    			attr_dev(nav, "class", "nav");
    			add_location(nav, file$a, 8, 0, 291);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div0);
    			mount_component(logo, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, ul0);
    			mount_component(navlink0, ul0, null);
    			append_dev(ul0, t1);
    			mount_component(navlink1, ul0, null);
    			append_dev(ul0, t2);
    			mount_component(navlink2, ul0, null);
    			append_dev(div0, t3);
    			append_dev(div0, ul1);
    			mount_component(navlink3, ul1, null);
    			append_dev(ul1, t4);
    			append_dev(ul1, li);
    			append_dev(li, button);
    			mount_component(icon, button, null);
    			append_dev(button, t5);
    			append_dev(button, span);
    			append_dev(nav, t7);
    			append_dev(nav, div1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*services*/ ctx[0].auth.logout, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const navlink0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink0_changes.$$scope = { dirty, ctx };
    			}

    			navlink0.$set(navlink0_changes);
    			const navlink1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink1_changes.$$scope = { dirty, ctx };
    			}

    			navlink1.$set(navlink1_changes);
    			const navlink2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink2_changes.$$scope = { dirty, ctx };
    			}

    			navlink2.$set(navlink2_changes);
    			const navlink3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				navlink3_changes.$$scope = { dirty, ctx };
    			}

    			navlink3.$set(navlink3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(navlink0.$$.fragment, local);
    			transition_in(navlink1.$$.fragment, local);
    			transition_in(navlink2.$$.fragment, local);
    			transition_in(navlink3.$$.fragment, local);
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(navlink0.$$.fragment, local);
    			transition_out(navlink1.$$.fragment, local);
    			transition_out(navlink2.$$.fragment, local);
    			transition_out(navlink3.$$.fragment, local);
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(logo);
    			destroy_component(navlink0);
    			destroy_component(navlink1);
    			destroy_component(navlink2);
    			destroy_component(navlink3);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nav', slots, []);
    	const services = getServices();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Routes,
    		getServices,
    		Icon,
    		Logo,
    		NavLink,
    		services
    	});

    	return [services];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const capitalize = (str) => {
        if (str.length < 1) {
            return str;
        }
        const [firstLetter, ...others] = str.split('');
        return `${firstLetter.toLocaleUpperCase()}${others.join('')}`;
    };

    /* src\components\molecules\Drawer.svelte generated by Svelte v3.48.0 */
    const file$9 = "src\\components\\molecules\\Drawer.svelte";

    // (24:0) {#if shouldRender}
    function create_if_block$1(ctx) {
    	let aside;
    	let div1;
    	let h2;
    	let t0;
    	let t1;
    	let button0;
    	let icon;
    	let t2;
    	let div0;
    	let t3;
    	let form;
    	let t4;
    	let div2;
    	let button1;
    	let t5;
    	let div3;
    	let button2;
    	let aside_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { icon: "clear" }, $$inline: true });
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	button1 = new Button({
    			props: {
    				type: "submit",
    				size: "sm",
    				color: "primary",
    				fill: "filled",
    				cls: "-full-width -justify-center",
    				$$slots: { content: [create_content_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				size: "sm",
    				color: "neutral",
    				fill: "borderless",
    				cls: "-full-width -justify-center",
    				$$slots: { content: [create_content_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2.$on("click", /*wrappedOnCancel*/ ctx[5]);

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text(/*title*/ ctx[1]);
    			t1 = space();
    			button0 = element("button");
    			create_component(icon.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			t3 = space();
    			form = element("form");
    			if (default_slot) default_slot.c();
    			t4 = space();
    			div2 = element("div");
    			create_component(button1.$$.fragment);
    			t5 = space();
    			div3 = element("div");
    			create_component(button2.$$.fragment);
    			attr_dev(h2, "class", "text__heading--6--heavy");
    			add_location(h2, file$9, 26, 6, 754);
    			attr_dev(div0, "class", "-inline-flex -fill--neutral_3");
    			add_location(div0, file$9, 34, 8, 993);
    			attr_dev(button0, "class", "button button--sm--squared button--borderless--neutral");
    			add_location(button0, file$9, 29, 6, 828);
    			attr_dev(div1, "class", "-align-center -justify-space-between");
    			add_location(div1, file$9, 25, 4, 696);
    			attr_dev(div2, "class", "-mt--1000 -pt--500");
    			add_location(div2, file$9, 39, 6, 1173);
    			attr_dev(div3, "class", "-mt--600");
    			add_location(div3, file$9, 50, 6, 1490);
    			add_location(form, file$9, 37, 4, 1073);
    			attr_dev(aside, "class", aside_class_value = `drawer ${/*shouldAnimate*/ ctx[4] ? "drawer--expanded" : ""}`);
    			add_location(aside, file$9, 24, 2, 623);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(div1, t1);
    			append_dev(div1, button0);
    			mount_component(icon, button0, null);
    			append_dev(button0, t2);
    			append_dev(button0, div0);
    			append_dev(aside, t3);
    			append_dev(aside, form);

    			if (default_slot) {
    				default_slot.m(form, null);
    			}

    			append_dev(form, t4);
    			append_dev(form, div2);
    			mount_component(button1, div2, null);
    			append_dev(form, t5);
    			append_dev(form, div3);
    			mount_component(button2, div3, null);
    			/*form_binding*/ ctx[9](form);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*wrappedOnCancel*/ ctx[5], false, false, false),
    					listen_dev(
    						form,
    						"submit",
    						prevent_default(function () {
    							if (is_function(withFormData(/*onSubmit*/ ctx[2]))) withFormData(/*onSubmit*/ ctx[2]).apply(this, arguments);
    						}),
    						false,
    						true,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*title*/ 2) set_data_dev(t0, /*title*/ ctx[1]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 1024) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);

    			if (!current || dirty & /*shouldAnimate*/ 16 && aside_class_value !== (aside_class_value = `drawer ${/*shouldAnimate*/ ctx[4] ? "drawer--expanded" : ""}`)) {
    				attr_dev(aside, "class", aside_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(icon);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(button1);
    			destroy_component(button2);
    			/*form_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(24:0) {#if shouldRender}",
    		ctx
    	});

    	return block;
    }

    // (48:10) 
    function create_content_slot_1$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Submit";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--inverted");
    			add_location(span, file$9, 47, 10, 1388);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot_1$1.name,
    		type: "slot",
    		source: "(48:10) ",
    		ctx
    	});

    	return block;
    }

    // (59:10) 
    function create_content_slot$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Cancel";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--neutral_5");
    			add_location(span, file$9, 58, 10, 1712);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$2.name,
    		type: "slot",
    		source: "(59:10) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*shouldRender*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*shouldRender*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*shouldRender*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Drawer', slots, ['default']);
    	let { title } = $$props;
    	let { open } = $$props;
    	let { formRef = null } = $$props;
    	let { onSubmit } = $$props;
    	let { onCancel } = $$props;
    	let shouldRender = false;
    	let shouldAnimate = false;

    	let wrappedOnCancel = () => {
    		setTimeout(() => $$invalidate(3, shouldRender = false), 150);
    		$$invalidate(4, shouldAnimate = false);
    		onCancel();
    	};

    	const writable_props = ['title', 'open', 'formRef', 'onSubmit', 'onCancel'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Drawer> was created with unknown prop '${key}'`);
    	});

    	function form_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			formRef = $$value;
    			$$invalidate(0, formRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('open' in $$props) $$invalidate(6, open = $$props.open);
    		if ('formRef' in $$props) $$invalidate(0, formRef = $$props.formRef);
    		if ('onSubmit' in $$props) $$invalidate(2, onSubmit = $$props.onSubmit);
    		if ('onCancel' in $$props) $$invalidate(7, onCancel = $$props.onCancel);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		withFormData,
    		Icon,
    		Button,
    		title,
    		open,
    		formRef,
    		onSubmit,
    		onCancel,
    		shouldRender,
    		shouldAnimate,
    		wrappedOnCancel
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('open' in $$props) $$invalidate(6, open = $$props.open);
    		if ('formRef' in $$props) $$invalidate(0, formRef = $$props.formRef);
    		if ('onSubmit' in $$props) $$invalidate(2, onSubmit = $$props.onSubmit);
    		if ('onCancel' in $$props) $$invalidate(7, onCancel = $$props.onCancel);
    		if ('shouldRender' in $$props) $$invalidate(3, shouldRender = $$props.shouldRender);
    		if ('shouldAnimate' in $$props) $$invalidate(4, shouldAnimate = $$props.shouldAnimate);
    		if ('wrappedOnCancel' in $$props) $$invalidate(5, wrappedOnCancel = $$props.wrappedOnCancel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 64) {
    			if (open) {
    				setTimeout(() => $$invalidate(3, shouldRender = true));
    			}
    		}

    		if ($$self.$$.dirty & /*shouldRender*/ 8) {
    			if (shouldRender) {
    				setTimeout(() => $$invalidate(4, shouldAnimate = true), 10);
    			}
    		}
    	};

    	return [
    		formRef,
    		title,
    		onSubmit,
    		shouldRender,
    		shouldAnimate,
    		wrappedOnCancel,
    		open,
    		onCancel,
    		slots,
    		form_binding,
    		$$scope
    	];
    }

    class Drawer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			title: 1,
    			open: 6,
    			formRef: 0,
    			onSubmit: 2,
    			onCancel: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Drawer",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[1] === undefined && !('title' in props)) {
    			console.warn("<Drawer> was created without expected prop 'title'");
    		}

    		if (/*open*/ ctx[6] === undefined && !('open' in props)) {
    			console.warn("<Drawer> was created without expected prop 'open'");
    		}

    		if (/*onSubmit*/ ctx[2] === undefined && !('onSubmit' in props)) {
    			console.warn("<Drawer> was created without expected prop 'onSubmit'");
    		}

    		if (/*onCancel*/ ctx[7] === undefined && !('onCancel' in props)) {
    			console.warn("<Drawer> was created without expected prop 'onCancel'");
    		}
    	}

    	get title() {
    		throw new Error("<Drawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Drawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<Drawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Drawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formRef() {
    		throw new Error("<Drawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formRef(value) {
    		throw new Error("<Drawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSubmit() {
    		throw new Error("<Drawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSubmit(value) {
    		throw new Error("<Drawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<Drawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<Drawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\RadioGroup.svelte generated by Svelte v3.48.0 */
    const file$8 = "src\\components\\molecules\\RadioGroup.svelte";

    function create_fragment$9(ctx) {
    	let div2;
    	let div0;
    	let span;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let errormessage;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	errormessage = new ErrorMessage({
    			props: { error: /*error*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text(/*label*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t2 = space();
    			create_component(errormessage.$$.fragment);
    			attr_dev(span, "class", "text__paragraph--base--heavy");
    			add_location(span, file$8, 7, 4, 193);
    			attr_dev(div0, "class", "-pl--700 -pb--500");
    			add_location(div0, file$8, 6, 2, 156);
    			attr_dev(div1, "class", "-align-center -gap--700");
    			add_location(div1, file$8, 9, 2, 264);
    			attr_dev(div2, "class", "-full-width");
    			add_location(div2, file$8, 5, 0, 127);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t2);
    			mount_component(errormessage, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 1) set_data_dev(t0, /*label*/ ctx[0]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			const errormessage_changes = {};
    			if (dirty & /*error*/ 2) errormessage_changes.error = /*error*/ ctx[1];
    			errormessage.$set(errormessage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(errormessage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(errormessage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			destroy_component(errormessage);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioGroup', slots, ['default']);
    	let { label } = $$props;
    	let { error = null } = $$props;
    	const writable_props = ['label', 'error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RadioGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ ErrorMessage, label, error });

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('error' in $$props) $$invalidate(1, error = $$props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [label, error, $$scope, slots];
    }

    class RadioGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { label: 0, error: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioGroup",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<RadioGroup> was created without expected prop 'label'");
    		}
    	}

    	get label() {
    		throw new Error("<RadioGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<RadioGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get error() {
    		throw new Error("<RadioGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set error(value) {
    		throw new Error("<RadioGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\molecules\RadioInput.svelte generated by Svelte v3.48.0 */

    const file$7 = "src\\components\\molecules\\RadioInput.svelte";

    function create_fragment$8(ctx) {
    	let label_1;
    	let input;
    	let t0;
    	let span;
    	let t1;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text(/*label*/ ctx[1]);
    			attr_dev(input, "type", "radio");
    			attr_dev(input, "name", /*name*/ ctx[0]);
    			input.value = /*value*/ ctx[2];
    			attr_dev(input, "class", "-mr--200");
    			add_location(input, file$7, 6, 2, 98);
    			attr_dev(span, "class", "text__paragraph--base--regular");
    			add_location(span, file$7, 7, 2, 156);
    			add_location(label_1, file$7, 5, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, input);
    			append_dev(label_1, t0);
    			append_dev(label_1, span);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 1) {
    				attr_dev(input, "name", /*name*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 4) {
    				prop_dev(input, "value", /*value*/ ctx[2]);
    			}

    			if (dirty & /*label*/ 2) set_data_dev(t1, /*label*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioInput', slots, []);
    	let { name } = $$props;
    	let { label } = $$props;
    	let { value } = $$props;
    	const writable_props = ['name', 'label', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<RadioInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({ name, label, value });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('label' in $$props) $$invalidate(1, label = $$props.label);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, label, value];
    }

    class RadioInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { name: 0, label: 1, value: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioInput",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<RadioInput> was created without expected prop 'name'");
    		}

    		if (/*label*/ ctx[1] === undefined && !('label' in props)) {
    			console.warn("<RadioInput> was created without expected prop 'label'");
    		}

    		if (/*value*/ ctx[2] === undefined && !('value' in props)) {
    			console.warn("<RadioInput> was created without expected prop 'value'");
    		}
    	}

    	get name() {
    		throw new Error("<RadioInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<RadioInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<RadioInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<RadioInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<RadioInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<RadioInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\organisms\PantryItemDrawer.svelte generated by Svelte v3.48.0 */
    const file$6 = "src\\components\\organisms\\PantryItemDrawer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (1:0) <script lang="ts">import { getServices }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">import { getServices }",
    		ctx
    	});

    	return block;
    }

    // (95:2) {:then loadedMeasurmentUnits}
    function create_then_block$2(ctx) {
    	let div;
    	let textinput0;
    	let t0;
    	let textinput1;
    	let t1;
    	let inputlabel;
    	let t2;
    	let radiogroup;
    	let current;

    	textinput0 = new TextInput({
    			props: {
    				name: "name",
    				label: "Name",
    				error: /*fieldErrors*/ ctx[3].name
    			},
    			$$inline: true
    		});

    	textinput1 = new TextInput({
    			props: {
    				name: "image",
    				label: "Image",
    				type: "file",
    				cls: "-bg--inverted",
    				error: /*fieldErrors*/ ctx[3].image
    			},
    			$$inline: true
    		});

    	inputlabel = new InputLabel({
    			props: {
    				label: "Description",
    				error: /*fieldErrors*/ ctx[3].description,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	radiogroup = new RadioGroup({
    			props: {
    				label: "Measurment unit",
    				error: /*fieldErrors*/ ctx[3].unit,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(textinput0.$$.fragment);
    			t0 = space();
    			create_component(textinput1.$$.fragment);
    			t1 = space();
    			create_component(inputlabel.$$.fragment);
    			t2 = space();
    			create_component(radiogroup.$$.fragment);
    			attr_dev(div, "class", "-mt--1000 -pt--500 -direction-column -gap--800");
    			add_location(div, file$6, 95, 4, 3059);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(textinput0, div, null);
    			append_dev(div, t0);
    			mount_component(textinput1, div, null);
    			append_dev(div, t1);
    			mount_component(inputlabel, div, null);
    			append_dev(div, t2);
    			mount_component(radiogroup, div, null);
    			/*div_binding*/ ctx[8](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textinput0_changes = {};
    			if (dirty & /*fieldErrors*/ 8) textinput0_changes.error = /*fieldErrors*/ ctx[3].name;
    			textinput0.$set(textinput0_changes);
    			const textinput1_changes = {};
    			if (dirty & /*fieldErrors*/ 8) textinput1_changes.error = /*fieldErrors*/ ctx[3].image;
    			textinput1.$set(textinput1_changes);
    			const inputlabel_changes = {};
    			if (dirty & /*fieldErrors*/ 8) inputlabel_changes.error = /*fieldErrors*/ ctx[3].description;

    			if (dirty & /*$$scope*/ 131072) {
    				inputlabel_changes.$$scope = { dirty, ctx };
    			}

    			inputlabel.$set(inputlabel_changes);
    			const radiogroup_changes = {};
    			if (dirty & /*fieldErrors*/ 8) radiogroup_changes.error = /*fieldErrors*/ ctx[3].unit;

    			if (dirty & /*$$scope*/ 131072) {
    				radiogroup_changes.$$scope = { dirty, ctx };
    			}

    			radiogroup.$set(radiogroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput0.$$.fragment, local);
    			transition_in(textinput1.$$.fragment, local);
    			transition_in(inputlabel.$$.fragment, local);
    			transition_in(radiogroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput0.$$.fragment, local);
    			transition_out(textinput1.$$.fragment, local);
    			transition_out(inputlabel.$$.fragment, local);
    			transition_out(radiogroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(textinput0);
    			destroy_component(textinput1);
    			destroy_component(inputlabel);
    			destroy_component(radiogroup);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(95:2) {:then loadedMeasurmentUnits}",
    		ctx
    	});

    	return block;
    }

    // (108:6) <InputLabel label="Description" error={fieldErrors.description}>
    function create_default_slot_2$1(ctx) {
    	let textarea;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "name", "description");
    			attr_dev(textarea, "class", "input__input -bg--inverted -full-width");
    			attr_dev(textarea, "placeholder", "Description...");
    			add_location(textarea, file$6, 108, 8, 3479);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(108:6) <InputLabel label=\\\"Description\\\" error={fieldErrors.description}>",
    		ctx
    	});

    	return block;
    }

    // (116:8) {#each loadedMeasurmentUnits.data as measurmentUnit (measurmentUnit.id)}
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let radioinput;
    	let current;

    	radioinput = new RadioInput({
    			props: {
    				label: capitalize(/*measurmentUnit*/ ctx[14].name),
    				value: /*measurmentUnit*/ ctx[14].id,
    				name: "unit"
    			},
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(radioinput.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(radioinput, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radioinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radioinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(radioinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(116:8) {#each loadedMeasurmentUnits.data as measurmentUnit (measurmentUnit.id)}",
    		ctx
    	});

    	return block;
    }

    // (115:6) <RadioGroup label="Measurment unit" error={fieldErrors.unit}>
    function create_default_slot_1$2(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*loadedMeasurmentUnits*/ ctx[13].data;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*measurmentUnit*/ ctx[14].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*capitalize, measurmentUnits*/ 16) {
    				each_value = /*loadedMeasurmentUnits*/ ctx[13].data;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$2, each_1_anchor, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(115:6) <RadioGroup label=\\\"Measurment unit\\\" error={fieldErrors.unit}>",
    		ctx
    	});

    	return block;
    }

    // (93:26)       <Loading />    {:then loadedMeasurmentUnits}
    function create_pending_block$2(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(93:26)       <Loading />    {:then loadedMeasurmentUnits}",
    		ctx
    	});

    	return block;
    }

    // (92:0) <Drawer title="Add new product" {onSubmit} {onCancel} {open}>
    function create_default_slot$4(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 13,
    		blocks: [,,,]
    	};

    	handle_promise(/*measurmentUnits*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(92:0) <Drawer title=\\\"Add new product\\\" {onSubmit} {onCancel} {open}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let drawer;
    	let current;

    	drawer = new Drawer({
    			props: {
    				title: "Add new product",
    				onSubmit: /*onSubmit*/ ctx[5],
    				onCancel: /*onCancel*/ ctx[0],
    				open: /*open*/ ctx[1],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(drawer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(drawer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const drawer_changes = {};
    			if (dirty & /*onCancel*/ 1) drawer_changes.onCancel = /*onCancel*/ ctx[0];
    			if (dirty & /*open*/ 2) drawer_changes.open = /*open*/ ctx[1];

    			if (dirty & /*$$scope, formContainerRef, fieldErrors*/ 131084) {
    				drawer_changes.$$scope = { dirty, ctx };
    			}

    			drawer.$set(drawer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(drawer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(drawer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(drawer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PantryItemDrawer', slots, []);
    	let { onCancel } = $$props;
    	let { onSuccess } = $$props;
    	let { open } = $$props;
    	let { initialValues = {} } = $$props;
    	const services = getServices();
    	let formContainerRef = null;

    	let fieldErrors = {
    		name: null,
    		image: null,
    		description: null,
    		unit: null
    	};

    	let measurmentUnits = services.externalData.getMeasurmentUnits();

    	let updateFieldErrors = newErrors => {
    		$$invalidate(3, fieldErrors = mergeFieldErrors(fieldErrors, newErrors));
    	};

    	let onCreateSubmit = data => {
    		const name = data.get("name");
    		const image = data.get("image");
    		const description = data.get("description");
    		const unit = data.get("unit");
    		const localValidationResult = services.validation.validateAddPantryItemFields({ name, image, description, unit });

    		if (!localValidationResult.isValid || isNil(localValidationResult.validFields)) {
    			return updateFieldErrors(localValidationResult.errors);
    		} else {
    			updateFieldErrors(null);
    		}

    		services.externalData.createPantryItem(localValidationResult.validFields).then(response => {
    			if (!response.ok) {
    				updateFieldErrors(response.errors);
    			} else {
    				onSuccess();
    			}
    		});
    	};

    	let onEditSubmit = data => {
    		const name = data.get("name");
    		const image = data.get("image");
    		const description = data.get("description");
    		const unit = data.get("unit");

    		const localValidationResult = services.validation.validateEditPantryItemFields({
    			name,
    			image,
    			description,
    			unit,
    			id: initialValues.id
    		});

    		if (!localValidationResult.isValid || isNil(localValidationResult.validFields)) {
    			return updateFieldErrors(localValidationResult.errors);
    		} else {
    			updateFieldErrors(null);
    		}

    		services.externalData.updatePantryItem(localValidationResult.validFields).then(response => {
    			if (!response.ok) {
    				updateFieldErrors(response.errors);
    			} else {
    				onSuccess();
    			}
    		});
    	};

    	let onSubmit = !isNil(initialValues.id) ? onEditSubmit : onCreateSubmit;
    	const writable_props = ['onCancel', 'onSuccess', 'open', 'initialValues'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PantryItemDrawer> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			formContainerRef = $$value;
    			$$invalidate(2, formContainerRef);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('onCancel' in $$props) $$invalidate(0, onCancel = $$props.onCancel);
    		if ('onSuccess' in $$props) $$invalidate(6, onSuccess = $$props.onSuccess);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    		if ('initialValues' in $$props) $$invalidate(7, initialValues = $$props.initialValues);
    	};

    	$$self.$capture_state = () => ({
    		getServices,
    		mergeFieldErrors,
    		setInitialValues,
    		isNil,
    		capitalize,
    		Drawer,
    		InputLabel,
    		Loading,
    		RadioGroup,
    		RadioInput,
    		TextInput,
    		onCancel,
    		onSuccess,
    		open,
    		initialValues,
    		services,
    		formContainerRef,
    		fieldErrors,
    		measurmentUnits,
    		updateFieldErrors,
    		onCreateSubmit,
    		onEditSubmit,
    		onSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ('onCancel' in $$props) $$invalidate(0, onCancel = $$props.onCancel);
    		if ('onSuccess' in $$props) $$invalidate(6, onSuccess = $$props.onSuccess);
    		if ('open' in $$props) $$invalidate(1, open = $$props.open);
    		if ('initialValues' in $$props) $$invalidate(7, initialValues = $$props.initialValues);
    		if ('formContainerRef' in $$props) $$invalidate(2, formContainerRef = $$props.formContainerRef);
    		if ('fieldErrors' in $$props) $$invalidate(3, fieldErrors = $$props.fieldErrors);
    		if ('measurmentUnits' in $$props) $$invalidate(4, measurmentUnits = $$props.measurmentUnits);
    		if ('updateFieldErrors' in $$props) updateFieldErrors = $$props.updateFieldErrors;
    		if ('onCreateSubmit' in $$props) onCreateSubmit = $$props.onCreateSubmit;
    		if ('onEditSubmit' in $$props) onEditSubmit = $$props.onEditSubmit;
    		if ('onSubmit' in $$props) $$invalidate(5, onSubmit = $$props.onSubmit);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*formContainerRef, initialValues*/ 132) {
    			if (!isNil(formContainerRef)) {
    				setInitialValues(formContainerRef, initialValues);
    			}
    		}
    	};

    	return [
    		onCancel,
    		open,
    		formContainerRef,
    		fieldErrors,
    		measurmentUnits,
    		onSubmit,
    		onSuccess,
    		initialValues,
    		div_binding
    	];
    }

    class PantryItemDrawer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			onCancel: 0,
    			onSuccess: 6,
    			open: 1,
    			initialValues: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PantryItemDrawer",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onCancel*/ ctx[0] === undefined && !('onCancel' in props)) {
    			console.warn("<PantryItemDrawer> was created without expected prop 'onCancel'");
    		}

    		if (/*onSuccess*/ ctx[6] === undefined && !('onSuccess' in props)) {
    			console.warn("<PantryItemDrawer> was created without expected prop 'onSuccess'");
    		}

    		if (/*open*/ ctx[1] === undefined && !('open' in props)) {
    			console.warn("<PantryItemDrawer> was created without expected prop 'open'");
    		}
    	}

    	get onCancel() {
    		throw new Error("<PantryItemDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<PantryItemDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSuccess() {
    		throw new Error("<PantryItemDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSuccess(value) {
    		throw new Error("<PantryItemDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<PantryItemDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<PantryItemDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get initialValues() {
    		throw new Error("<PantryItemDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set initialValues(value) {
    		throw new Error("<PantryItemDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\organisms\Table.svelte generated by Svelte v3.48.0 */

    const file$5 = "src\\components\\organisms\\Table.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (8:6) {#each data.headers as header}
    function create_each_block_2(ctx) {
    	let th;
    	let t_value = /*header*/ ctx[8] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "text__paragraph--base--regular");
    			add_location(th, file$5, 8, 8, 170);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = /*header*/ ctx[8] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(8:6) {#each data.headers as header}",
    		ctx
    	});

    	return block;
    }

    // (16:8) {#each row as cell}
    function create_each_block_1(ctx) {
    	let td;
    	let t_value = /*cell*/ ctx[5] + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "text__paragraph--base--light");
    			add_location(td, file$5, 16, 10, 358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = /*cell*/ ctx[5] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(16:8) {#each row as cell}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {#each data.rows as row}
    function create_each_block$1(ctx) {
    	let tr;
    	let t;
    	let each_value_1 = /*row*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$5, 14, 6, 313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2) {
    				each_value_1 = /*row*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(14:4) {#each data.rows as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let table;
    	let thead;
    	let tr;
    	let t;
    	let tbody;
    	let table_class_value;
    	let each_value_2 = /*data*/ ctx[1].headers;
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = /*data*/ ctx[1].rows;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$5, 6, 4, 118);
    			add_location(thead, file$5, 5, 2, 105);
    			add_location(tbody, file$5, 12, 2, 268);
    			attr_dev(table, "class", table_class_value = `${/*cls*/ ctx[0]} table`);
    			add_location(table, file$5, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 2) {
    				each_value_2 = /*data*/ ctx[1].headers;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*data*/ 2) {
    				each_value = /*data*/ ctx[1].rows;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*cls*/ 1 && table_class_value !== (table_class_value = `${/*cls*/ ctx[0]} table`)) {
    				attr_dev(table, "class", table_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	let { cls = "" } = $$props;
    	let { data } = $$props;
    	const writable_props = ['cls', 'data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('cls' in $$props) $$invalidate(0, cls = $$props.cls);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ cls, data });

    	$$self.$inject_state = $$props => {
    		if ('cls' in $$props) $$invalidate(0, cls = $$props.cls);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [cls, data];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { cls: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !('data' in props)) {
    			console.warn("<Table> was created without expected prop 'data'");
    		}
    	}

    	get cls() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cls(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\organisms\Toolbar.svelte generated by Svelte v3.48.0 */
    const file$4 = "src\\components\\organisms\\Toolbar.svelte";

    function create_fragment$5(ctx) {
    	let div0;
    	let form;
    	let textinput;
    	let t0;
    	let t1;
    	let div1;
    	let current;

    	textinput = new TextInput({
    			props: {
    				name: "search",
    				placeholder: "Search",
    				ghost: true
    			},
    			$$inline: true
    		});

    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			form = element("form");
    			create_component(textinput.$$.fragment);
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			div1 = element("div");
    			add_location(form, file$4, 4, 2, 140);
    			attr_dev(div0, "class", "toolbar -py--700 -my--400 -px--1000");
    			add_location(div0, file$4, 3, 0, 87);
    			attr_dev(div1, "class", "divider--horizontal -full-width");
    			add_location(div1, file$4, 9, 0, 239);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, form);
    			mount_component(textinput, form, null);
    			append_dev(div0, t0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput.$$.fragment, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput.$$.fragment, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(textinput);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toolbar', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toolbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ TextInput });
    	return [$$scope, slots];
    }

    class Toolbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toolbar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\organisms\NotFound.svelte generated by Svelte v3.48.0 */

    const { console: console_1 } = globals;
    const file$3 = "src\\components\\organisms\\NotFound.svelte";

    // (8:0) {:else}
    function create_else_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "not found";
    			add_location(div, file$3, 8, 2, 157);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(8:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:0) {#if !isNil(data)}
    function create_if_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(6:0) {#if !isNil(data)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty & /*data*/ 1) show_if = null;
    		if (show_if == null) show_if = !!!isNil(/*data*/ ctx[0]);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, -1);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotFound', slots, ['default']);
    	let { data } = $$props;
    	console.log(data);
    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<NotFound> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ isNil, data });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, $$scope, slots];
    }

    class NotFound extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotFound",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[0] === undefined && !('data' in props)) {
    			console_1.warn("<NotFound> was created without expected prop 'data'");
    		}
    	}

    	get data() {
    		throw new Error("<NotFound>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<NotFound>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const useDrawer = ({ onSuccess: onSuccessCB }) => {
        const { subscribe, update } = writable(false);
        let onOpen = () => update(() => true);
        let onCancel = () => update(() => false);
        let onSuccess = () => {
            update(() => false);
            onSuccessCB();
        };
        return {
            isOpen: { subscribe },
            onCancel,
            onOpen,
            onSuccess
        };
    };

    /* src\pages\Product.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1$1 } = globals;
    const file$2 = "src\\pages\\Product.svelte";

    // (1:0) <script lang="ts">var __rest = (this && this.__rest) || function (s, e) {      var t = {}
    function create_catch_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block_1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">var __rest = (this && this.__rest) || function (s, e) {      var t = {}",
    		ctx
    	});

    	return block;
    }

    // (45:37)       <PantryItemDrawer        open={$isOpen}
    function create_then_block_1(ctx) {
    	let pantryitemdrawer;
    	let current;

    	pantryitemdrawer = new PantryItemDrawer({
    			props: {
    				open: /*$isOpen*/ ctx[1],
    				onCancel: /*methods*/ ctx[3].onCancel,
    				onSuccess: /*methods*/ ctx[3].onSuccess,
    				initialValues: {
    					name: /*loadedProduct*/ ctx[10].name,
    					description: /*loadedProduct*/ ctx[10].description,
    					unit: /*loadedProduct*/ ctx[10].unitId,
    					id: /*loadedProduct*/ ctx[10].id
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(pantryitemdrawer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pantryitemdrawer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const pantryitemdrawer_changes = {};
    			if (dirty & /*$isOpen*/ 2) pantryitemdrawer_changes.open = /*$isOpen*/ ctx[1];

    			if (dirty & /*product*/ 1) pantryitemdrawer_changes.initialValues = {
    				name: /*loadedProduct*/ ctx[10].name,
    				description: /*loadedProduct*/ ctx[10].description,
    				unit: /*loadedProduct*/ ctx[10].unitId,
    				id: /*loadedProduct*/ ctx[10].id
    			};

    			pantryitemdrawer.$set(pantryitemdrawer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pantryitemdrawer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pantryitemdrawer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pantryitemdrawer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block_1.name,
    		type: "then",
    		source: "(45:37)       <PantryItemDrawer        open={$isOpen}",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">var __rest = (this && this.__rest) || function (s, e) {      var t = {}
    function create_pending_block_1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block_1.name,
    		type: "pending",
    		source: "(1:0) <script lang=\\\"ts\\\">var __rest = (this && this.__rest) || function (s, e) {      var t = {}",
    		ctx
    	});

    	return block;
    }

    // (69:10) 
    function create_icon_slot_4(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				cls: "-fill--neutral_6",
    				icon: "trash_bin"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex");
    			add_location(div, file$2, 68, 10, 2527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_4.name,
    		type: "slot",
    		source: "(69:10) ",
    		ctx
    	});

    	return block;
    }

    // (80:10) 
    function create_icon_slot_3(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				cls: "-fill--neutral_3",
    				icon: "settings"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex");
    			add_location(div, file$2, 79, 10, 2837);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_3.name,
    		type: "slot",
    		source: "(80:10) ",
    		ctx
    	});

    	return block;
    }

    // (60:4) <Toolbar>
    function create_default_slot_1$1(ctx) {
    	let div;
    	let button0;
    	let t;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				size: "sm",
    				squared: true,
    				color: "neutral",
    				fill: "borderless",
    				$$slots: { icon: [create_icon_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*onDelete*/ ctx[4]);

    	button1 = new Button({
    			props: {
    				size: "sm",
    				squared: true,
    				color: "neutral",
    				fill: "borderless",
    				$$slots: { icon: [create_icon_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*methods*/ ctx[3].onOpen);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t = space();
    			create_component(button1.$$.fragment);
    			attr_dev(div, "class", "-align-center -gap--500");
    			add_location(div, file$2, 60, 6, 2323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(button0, div, null);
    			append_dev(div, t);
    			mount_component(button1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(60:4) <Toolbar>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">var __rest = (this && this.__rest) || function (s, e) {      var t = {}
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">var __rest = (this && this.__rest) || function (s, e) {      var t = {}",
    		ctx
    	});

    	return block;
    }

    // (89:4) {:then loadedProduct}
    function create_then_block$1(ctx) {
    	let notfound;
    	let current;

    	notfound = new NotFound({
    			props: {
    				data: /*loadedProduct*/ ctx[10],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notfound.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notfound, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notfound_changes = {};
    			if (dirty & /*product*/ 1) notfound_changes.data = /*loadedProduct*/ ctx[10];

    			if (dirty & /*$$scope, product*/ 2049) {
    				notfound_changes.$$scope = { dirty, ctx };
    			}

    			notfound.$set(notfound_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notfound.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notfound.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notfound, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(89:4) {:then loadedProduct}",
    		ctx
    	});

    	return block;
    }

    // (100:14) 
    function create_content_slot_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Add to a shopping list";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--neutral_3");
    			add_location(span, file$2, 99, 14, 3523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot_1.name,
    		type: "slot",
    		source: "(100:14) ",
    		ctx
    	});

    	return block;
    }

    // (103:14) 
    function create_icon_slot_2(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { cls: "-fill--neutral_3", icon: "add" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex");
    			add_location(div, file$2, 102, 14, 3649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_2.name,
    		type: "slot",
    		source: "(103:14) ",
    		ctx
    	});

    	return block;
    }

    // (122:16) 
    function create_content_slot$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "See recipes";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--action_primary");
    			add_location(span, file$2, 121, 16, 4453);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot$1.name,
    		type: "slot",
    		source: "(122:16) ",
    		ctx
    	});

    	return block;
    }

    // (125:16) 
    function create_icon_slot_1(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: {
    				cls: "-fill--action_primary",
    				icon: "arrow_forward"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex");
    			add_location(div, file$2, 124, 16, 4579);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot_1.name,
    		type: "slot",
    		source: "(125:16) ",
    		ctx
    	});

    	return block;
    }

    // (139:18) 
    function create_icon_slot$1(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { cls: "-fill--neutral_3", icon: "add" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex");
    			add_location(div, file$2, 138, 18, 5209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot$1.name,
    		type: "slot",
    		source: "(139:18) ",
    		ctx
    	});

    	return block;
    }

    // (90:6) <NotFound data={loadedProduct}>
    function create_default_slot$3(ctx) {
    	let div8;
    	let div0;
    	let image;
    	let t0;
    	let button0;
    	let t1;
    	let div7;
    	let div3;
    	let div2;
    	let h1;
    	let t2_value = /*loadedProduct*/ ctx[10].name + "";
    	let t2;
    	let t3;
    	let div1;
    	let p0;
    	let t5;
    	let p1;
    	let t7;
    	let button1;
    	let t8;
    	let div4;
    	let span;
    	let t9_value = /*loadedProduct*/ ctx[10].description + "";
    	let t9;
    	let t10;
    	let div6;
    	let div5;
    	let h2;
    	let t12;
    	let button2;
    	let t13;
    	let table;
    	let current;

    	image = new Image({
    			props: {
    				external: true,
    				alt: "product image",
    				src: /*loadedProduct*/ ctx[10].imageURL,
    				cls: "product__image"
    			},
    			$$inline: true
    		});

    	button0 = new Button({
    			props: {
    				size: "sm",
    				color: "neutral",
    				fill: "ghost",
    				$$slots: {
    					icon: [create_icon_slot_2],
    					content: [create_content_slot_1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1 = new Button({
    			props: {
    				size: "sm",
    				color: "primary",
    				fill: "ghost",
    				$$slots: {
    					icon: [create_icon_slot_1],
    					content: [create_content_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button2 = new Button({
    			props: {
    				size: "sm",
    				squared: true,
    				color: "neutral",
    				fill: "borderless",
    				$$slots: { icon: [create_icon_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				cls: "-mt--500",
    				data: {
    					headers: ["Date", "Amount bought", "Amount used", "Spoils in"],
    					rows: [["2022.04.01", "0.5 kg / 1pc.", "0 kg", "1 day"]]
    				}
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div0 = element("div");
    			create_component(image.$$.fragment);
    			t0 = space();
    			create_component(button0.$$.fragment);
    			t1 = space();
    			div7 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			p0 = element("p");
    			p0.textContent = "Available:";
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "4 kg / 12pcs.";
    			t7 = space();
    			create_component(button1.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			span = element("span");
    			t9 = text(t9_value);
    			t10 = space();
    			div6 = element("div");
    			div5 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Purchase history";
    			t12 = space();
    			create_component(button2.$$.fragment);
    			t13 = space();
    			create_component(table.$$.fragment);
    			attr_dev(div0, "class", "-full-width product__left_column");
    			add_location(div0, file$2, 91, 10, 3225);
    			attr_dev(h1, "class", "text__heading--2--regular");
    			add_location(h1, file$2, 110, 16, 3961);
    			attr_dev(p0, "class", "text__paragraph--small--light");
    			add_location(p0, file$2, 112, 18, 4084);
    			attr_dev(p1, "class", "text__paragraph--base--regular item_description__amount");
    			add_location(p1, file$2, 113, 18, 4159);
    			attr_dev(div1, "class", "-mt--700");
    			add_location(div1, file$2, 111, 16, 4042);
    			add_location(div2, file$2, 109, 14, 3938);
    			attr_dev(div3, "class", "-full-width product__info");
    			add_location(div3, file$2, 108, 12, 3883);
    			attr_dev(span, "class", "text__paragraph--base--light");
    			add_location(span, file$2, 130, 14, 4815);
    			attr_dev(div4, "class", "-mt--900");
    			add_location(div4, file$2, 129, 12, 4777);
    			attr_dev(h2, "class", "text__heading--4--regular");
    			add_location(h2, file$2, 136, 16, 5052);
    			attr_dev(div5, "class", "-align-center");
    			add_location(div5, file$2, 135, 14, 5007);
    			attr_dev(div6, "class", "-mt--900 -pt--900");
    			add_location(div6, file$2, 134, 12, 4960);
    			attr_dev(div7, "class", "-full-width product__right_column");
    			add_location(div7, file$2, 107, 10, 3822);
    			attr_dev(div8, "class", "-pt--900 -px--1000 product");
    			add_location(div8, file$2, 90, 8, 3173);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div0);
    			mount_component(image, div0, null);
    			append_dev(div0, t0);
    			mount_component(button0, div0, null);
    			append_dev(div8, t1);
    			append_dev(div8, div7);
    			append_dev(div7, div3);
    			append_dev(div3, div2);
    			append_dev(div2, h1);
    			append_dev(h1, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, p0);
    			append_dev(div1, t5);
    			append_dev(div1, p1);
    			append_dev(div3, t7);
    			mount_component(button1, div3, null);
    			append_dev(div7, t8);
    			append_dev(div7, div4);
    			append_dev(div4, span);
    			append_dev(span, t9);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, h2);
    			append_dev(div5, t12);
    			mount_component(button2, div5, null);
    			append_dev(div6, t13);
    			mount_component(table, div6, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const image_changes = {};
    			if (dirty & /*product*/ 1) image_changes.src = /*loadedProduct*/ ctx[10].imageURL;
    			image.$set(image_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			if ((!current || dirty & /*product*/ 1) && t2_value !== (t2_value = /*loadedProduct*/ ctx[10].name + "")) set_data_dev(t2, t2_value);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			if ((!current || dirty & /*product*/ 1) && t9_value !== (t9_value = /*loadedProduct*/ ctx[10].description + "")) set_data_dev(t9, t9_value);
    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			destroy_component(image);
    			destroy_component(button0);
    			destroy_component(button1);
    			destroy_component(button2);
    			destroy_component(table);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(90:6) <NotFound data={loadedProduct}>",
    		ctx
    	});

    	return block;
    }

    // (87:20)         <Loading />      {:then loadedProduct}
    function create_pending_block$1(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(87:20)         <Loading />      {:then loadedProduct}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let stylesheet;
    	let t0;
    	let div1;
    	let promise;
    	let t1;
    	let nav;
    	let t2;
    	let main;
    	let toolbar;
    	let t3;
    	let div0;
    	let t4;
    	let promise_1;
    	let current;

    	stylesheet = new Stylesheet({
    			props: { src: "pages/product.css" },
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block_1,
    		then: create_then_block_1,
    		catch: create_catch_block_1,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*product*/ ctx[0], info);
    	nav = new Nav({ $$inline: true });

    	toolbar = new Toolbar({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info_1 = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 10,
    		blocks: [,,,]
    	};

    	handle_promise(promise_1 = /*product*/ ctx[0], info_1);

    	const block = {
    		c: function create() {
    			create_component(stylesheet.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			info.block.c();
    			t1 = space();
    			create_component(nav.$$.fragment);
    			t2 = space();
    			main = element("main");
    			create_component(toolbar.$$.fragment);
    			t3 = space();
    			div0 = element("div");
    			t4 = space();
    			info_1.block.c();
    			attr_dev(div0, "class", "divider--horizontal -full-width");
    			add_location(div0, file$2, 85, 4, 3009);
    			attr_dev(main, "class", "page__main");
    			add_location(main, file$2, 58, 2, 2275);
    			attr_dev(div1, "class", "page");
    			add_location(div1, file$2, 43, 0, 1880);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(stylesheet, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			info.block.m(div1, info.anchor = null);
    			info.mount = () => div1;
    			info.anchor = t1;
    			append_dev(div1, t1);
    			mount_component(nav, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, main);
    			mount_component(toolbar, main, null);
    			append_dev(main, t3);
    			append_dev(main, div0);
    			append_dev(main, t4);
    			info_1.block.m(main, info_1.anchor = null);
    			info_1.mount = () => main;
    			info_1.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*product*/ 1 && promise !== (promise = /*product*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			const toolbar_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				toolbar_changes.$$scope = { dirty, ctx };
    			}

    			toolbar.$set(toolbar_changes);
    			info_1.ctx = ctx;

    			if (dirty & /*product*/ 1 && promise_1 !== (promise_1 = /*product*/ ctx[0]) && handle_promise(promise_1, info_1)) ; else {
    				update_await_block_branch(info_1, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stylesheet.$$.fragment, local);
    			transition_in(info.block);
    			transition_in(nav.$$.fragment, local);
    			transition_in(toolbar.$$.fragment, local);
    			transition_in(info_1.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stylesheet.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			transition_out(nav.$$.fragment, local);
    			transition_out(toolbar.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info_1.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stylesheet, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_component(nav);
    			destroy_component(toolbar);
    			info_1.block.d();
    			info_1.token = null;
    			info_1 = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $isOpen;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Product', slots, []);

    	var __rest = this && this.__rest || function (s, e) {
    		var t = {};
    		for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

    		if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    			if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    		}

    		return t;
    	};

    	let { productId } = $$props;
    	const services = getServices();
    	const navigate = useNavigate();

    	const _a = useDrawer({
    			onSuccess: () => $$invalidate(0, product = services.externalData.getPantryItem(productId))
    		}),
    		{ isOpen } = _a,
    		methods = __rest(_a, ["isOpen"]);

    	validate_store(isOpen, 'isOpen');
    	component_subscribe($$self, isOpen, value => $$invalidate(1, $isOpen = value));
    	let product = services.externalData.getPantryItem(productId);

    	const onDelete = () => {
    		services.externalData.deletePantryItem(productId).then(response => {
    			if (response.ok) {
    				navigate(Routes.pantry);
    			}
    		});
    	};

    	const writable_props = ['productId'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('productId' in $$props) $$invalidate(5, productId = $$props.productId);
    	};

    	$$self.$capture_state = () => ({
    		__rest,
    		useNavigate,
    		Icon,
    		Image,
    		Stylesheet,
    		Button,
    		Loading,
    		Nav,
    		PantryItemDrawer,
    		Table,
    		Toolbar,
    		NotFound,
    		Routes,
    		useDrawer,
    		getServices,
    		productId,
    		services,
    		navigate,
    		_a,
    		isOpen,
    		methods,
    		product,
    		onDelete,
    		$isOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ('__rest' in $$props) __rest = $$props.__rest;
    		if ('productId' in $$props) $$invalidate(5, productId = $$props.productId);
    		if ('product' in $$props) $$invalidate(0, product = $$props.product);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [product, $isOpen, isOpen, methods, onDelete, productId];
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { productId: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Product",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*productId*/ ctx[5] === undefined && !('productId' in props)) {
    			console.warn("<Product> was created without expected prop 'productId'");
    		}
    	}

    	get productId() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productId(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\organisms\PantryItem.svelte generated by Svelte v3.48.0 */
    const file$1 = "src\\components\\organisms\\PantryItem.svelte";

    // (9:2) <Link to={generatePath(Routes.product, { id: item.id })} class="item_link">
    function create_default_slot$2(ctx) {
    	let image;
    	let t0;
    	let div1;
    	let div0;
    	let h3;
    	let t1_value = /*item*/ ctx[0].name + "";
    	let t1;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let current;

    	image = new Image({
    			props: {
    				external: true,
    				src: /*item*/ ctx[0].imageURL,
    				alt: /*item*/ ctx[0].name
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(image.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Available:";
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "4 kg / 12pcs.";
    			attr_dev(h3, "class", "text__small_caps--regular");
    			add_location(h3, file$1, 12, 8, 464);
    			add_location(div0, file$1, 11, 6, 449);
    			attr_dev(p0, "class", "text__paragraph--small--light -mt--500");
    			add_location(p0, file$1, 14, 6, 540);
    			attr_dev(p1, "class", "text__paragraph--base--regular item_description__amount");
    			add_location(p1, file$1, 15, 6, 612);
    			attr_dev(div1, "class", "item_description -pt--300");
    			add_location(div1, file$1, 10, 4, 402);
    		},
    		m: function mount(target, anchor) {
    			mount_component(image, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, p0);
    			append_dev(div1, t4);
    			append_dev(div1, p1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const image_changes = {};
    			if (dirty & /*item*/ 1) image_changes.src = /*item*/ ctx[0].imageURL;
    			if (dirty & /*item*/ 1) image_changes.alt = /*item*/ ctx[0].name;
    			image.$set(image_changes);
    			if ((!current || dirty & /*item*/ 1) && t1_value !== (t1_value = /*item*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(image.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(image.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(image, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(9:2) <Link to={generatePath(Routes.product, { id: item.id })} class=\\\"item_link\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let li;
    	let link;
    	let current;

    	link = new Link$1({
    			props: {
    				to: generatePath(Routes.product, { id: /*item*/ ctx[0].id }),
    				class: "item_link",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			attr_dev(li, "class", "pantry_list__item");
    			add_location(li, file$1, 7, 0, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};
    			if (dirty & /*item*/ 1) link_changes.to = generatePath(Routes.product, { id: /*item*/ ctx[0].id });

    			if (dirty & /*$$scope, item*/ 3) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PantryItem', slots, []);
    	let { item } = $$props;
    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PantryItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ Link: Link$1, Routes, generatePath, Image, item });

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item];
    }

    class PantryItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PantryItem",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<PantryItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<PantryItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<PantryItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Pantry.svelte generated by Svelte v3.48.0 */

    const { Object: Object_1 } = globals;
    const file = "src\\pages\\Pantry.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (41:8) 
    function create_content_slot(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Add new";
    			attr_dev(span, "slot", "content");
    			attr_dev(span, "class", "-color--inverted");
    			add_location(span, file, 40, 8, 1695);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_content_slot.name,
    		type: "slot",
    		source: "(41:8) ",
    		ctx
    	});

    	return block;
    }

    // (42:8) 
    function create_icon_slot(ctx) {
    	let div;
    	let icon;
    	let current;

    	icon = new Icon({
    			props: { cls: "-fill--inverted", icon: "add" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "slot", "icon");
    			attr_dev(div, "class", "-inline-flex");
    			add_location(div, file, 41, 8, 1767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(42:8) ",
    		ctx
    	});

    	return block;
    }

    // (39:4) <Toolbar>
    function create_default_slot$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				size: "sm",
    				color: "primary",
    				fill: "filled",
    				$$slots: {
    					icon: [create_icon_slot],
    					content: [create_content_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*methods*/ ctx[3].onOpen);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(39:4) <Toolbar>",
    		ctx
    	});

    	return block;
    }

    // (1:0) <script lang="ts">var __rest = (this && this.__rest) || function (s, e) {      var t = {}
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script lang=\\\"ts\\\">var __rest = (this && this.__rest) || function (s, e) {      var t = {}",
    		ctx
    	});

    	return block;
    }

    // (50:6) {:then loadedItems}
    function create_then_block(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*loadedItems*/ ctx[7];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[8].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*items*/ 1) {
    				each_value = /*loadedItems*/ ctx[7];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(50:6) {:then loadedItems}",
    		ctx
    	});

    	return block;
    }

    // (51:8) {#each loadedItems as item (item.id)}
    function create_each_block(key_1, ctx) {
    	let first;
    	let pantryitem;
    	let current;

    	pantryitem = new PantryItem({
    			props: { item: /*item*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(pantryitem.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(pantryitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const pantryitem_changes = {};
    			if (dirty & /*items*/ 1) pantryitem_changes.item = /*item*/ ctx[8];
    			pantryitem.$set(pantryitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pantryitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pantryitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(pantryitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(51:8) {#each loadedItems as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    // (48:20)           <Loading />        {:then loadedItems}
    function create_pending_block(ctx) {
    	let loading;
    	let current;
    	loading = new Loading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loading, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(48:20)           <Loading />        {:then loadedItems}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let stylesheet;
    	let t0;
    	let div;
    	let pantryitemdrawer;
    	let t1;
    	let nav;
    	let t2;
    	let main;
    	let toolbar;
    	let t3;
    	let ul;
    	let promise;
    	let current;

    	stylesheet = new Stylesheet({
    			props: { src: "pages/pantry.css" },
    			$$inline: true
    		});

    	pantryitemdrawer = new PantryItemDrawer({
    			props: {
    				open: /*$isOpen*/ ctx[1],
    				onCancel: /*methods*/ ctx[3].onCancel,
    				onSuccess: /*methods*/ ctx[3].onSuccess
    			},
    			$$inline: true
    		});

    	nav = new Nav({ $$inline: true });

    	toolbar = new Toolbar({
    			props: {
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 7,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*items*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			create_component(stylesheet.$$.fragment);
    			t0 = space();
    			div = element("div");
    			create_component(pantryitemdrawer.$$.fragment);
    			t1 = space();
    			create_component(nav.$$.fragment);
    			t2 = space();
    			main = element("main");
    			create_component(toolbar.$$.fragment);
    			t3 = space();
    			ul = element("ul");
    			info.block.c();
    			attr_dev(ul, "class", "pantry_list -px--700 -py--1000");
    			add_location(ul, file, 46, 4, 1913);
    			attr_dev(main, "class", "page__main");
    			add_location(main, file, 37, 2, 1563);
    			attr_dev(div, "class", "page");
    			add_location(div, file, 30, 0, 1415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(stylesheet, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			mount_component(pantryitemdrawer, div, null);
    			append_dev(div, t1);
    			mount_component(nav, div, null);
    			append_dev(div, t2);
    			append_dev(div, main);
    			mount_component(toolbar, main, null);
    			append_dev(main, t3);
    			append_dev(main, ul);
    			info.block.m(ul, info.anchor = null);
    			info.mount = () => ul;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const pantryitemdrawer_changes = {};
    			if (dirty & /*$isOpen*/ 2) pantryitemdrawer_changes.open = /*$isOpen*/ ctx[1];
    			pantryitemdrawer.$set(pantryitemdrawer_changes);
    			const toolbar_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				toolbar_changes.$$scope = { dirty, ctx };
    			}

    			toolbar.$set(toolbar_changes);
    			info.ctx = ctx;

    			if (dirty & /*items*/ 1 && promise !== (promise = /*items*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stylesheet.$$.fragment, local);
    			transition_in(pantryitemdrawer.$$.fragment, local);
    			transition_in(nav.$$.fragment, local);
    			transition_in(toolbar.$$.fragment, local);
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stylesheet.$$.fragment, local);
    			transition_out(pantryitemdrawer.$$.fragment, local);
    			transition_out(nav.$$.fragment, local);
    			transition_out(toolbar.$$.fragment, local);

    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stylesheet, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(pantryitemdrawer);
    			destroy_component(nav);
    			destroy_component(toolbar);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $isOpen;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pantry', slots, []);

    	var __rest = this && this.__rest || function (s, e) {
    		var t = {};
    		for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

    		if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    			if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
    		}

    		return t;
    	};

    	const services = getServices();
    	let items = services.externalData.getPantryItems();

    	const _a = useDrawer({
    			onSuccess: () => $$invalidate(0, items = services.externalData.getPantryItems())
    		}),
    		{ isOpen } = _a,
    		methods = __rest(_a, ["isOpen"]);

    	validate_store(isOpen, 'isOpen');
    	component_subscribe($$self, isOpen, value => $$invalidate(1, $isOpen = value));
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Pantry> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__rest,
    		Icon,
    		Stylesheet,
    		Button,
    		Loading,
    		PantryItemDrawer,
    		Nav,
    		PantryItem,
    		Toolbar,
    		getServices,
    		useDrawer,
    		services,
    		items,
    		_a,
    		isOpen,
    		methods,
    		$isOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ('__rest' in $$props) __rest = $$props.__rest;
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, $isOpen, isOpen, methods];
    }

    class Pantry extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pantry",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.48.0 */

    // (14:3) <AuthRoute isProtected={false} redirectTo={Routes.pantry}>
    function create_default_slot_10(ctx) {
    	let auth;
    	let current;
    	auth = new Auth({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(auth.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(auth, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auth.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auth.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(auth, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(14:3) <AuthRoute isProtected={false} redirectTo={Routes.pantry}>",
    		ctx
    	});

    	return block;
    }

    // (13:2) <Route path={Routes.register}>
    function create_default_slot_9(ctx) {
    	let authroute;
    	let current;

    	authroute = new AuthRoute({
    			props: {
    				isProtected: false,
    				redirectTo: Routes.pantry,
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(authroute.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(authroute, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const authroute_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				authroute_changes.$$scope = { dirty, ctx };
    			}

    			authroute.$set(authroute_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authroute.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authroute.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(authroute, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(13:2) <Route path={Routes.register}>",
    		ctx
    	});

    	return block;
    }

    // (19:3) <AuthRoute isProtected={false} redirectTo={Routes.pantry}>
    function create_default_slot_8(ctx) {
    	let auth;
    	let current;
    	auth = new Auth({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(auth.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(auth, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(auth.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(auth.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(auth, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(19:3) <AuthRoute isProtected={false} redirectTo={Routes.pantry}>",
    		ctx
    	});

    	return block;
    }

    // (18:2) <Route path={Routes.login}>
    function create_default_slot_7(ctx) {
    	let authroute;
    	let current;

    	authroute = new AuthRoute({
    			props: {
    				isProtected: false,
    				redirectTo: Routes.pantry,
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(authroute.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(authroute, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const authroute_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				authroute_changes.$$scope = { dirty, ctx };
    			}

    			authroute.$set(authroute_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authroute.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authroute.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(authroute, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(18:2) <Route path={Routes.login}>",
    		ctx
    	});

    	return block;
    }

    // (24:3) <AuthRoute isProtected redirectTo={Routes.login}>
    function create_default_slot_6(ctx) {
    	let pantry;
    	let current;
    	pantry = new Pantry({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pantry.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pantry, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pantry.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pantry.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pantry, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(24:3) <AuthRoute isProtected redirectTo={Routes.login}>",
    		ctx
    	});

    	return block;
    }

    // (23:2) <Route path={Routes.pantry}>
    function create_default_slot_5(ctx) {
    	let authroute;
    	let current;

    	authroute = new AuthRoute({
    			props: {
    				isProtected: true,
    				redirectTo: Routes.login,
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(authroute.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(authroute, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const authroute_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				authroute_changes.$$scope = { dirty, ctx };
    			}

    			authroute.$set(authroute_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authroute.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authroute.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(authroute, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(23:2) <Route path={Routes.pantry}>",
    		ctx
    	});

    	return block;
    }

    // (29:3) <AuthRoute isProtected redirectTo={Routes.login}>
    function create_default_slot_4(ctx) {
    	let product;
    	let current;

    	product = new Product({
    			props: { productId: /*params*/ ctx[0].id },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(product.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(product, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const product_changes = {};
    			if (dirty & /*params*/ 1) product_changes.productId = /*params*/ ctx[0].id;
    			product.$set(product_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(product, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(29:3) <AuthRoute isProtected redirectTo={Routes.login}>",
    		ctx
    	});

    	return block;
    }

    // (28:2) <Route path={Routes.product} let:params>
    function create_default_slot_3(ctx) {
    	let authroute;
    	let current;

    	authroute = new AuthRoute({
    			props: {
    				isProtected: true,
    				redirectTo: Routes.login,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(authroute.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(authroute, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const authroute_changes = {};

    			if (dirty & /*$$scope, params*/ 3) {
    				authroute_changes.$$scope = { dirty, ctx };
    			}

    			authroute.$set(authroute_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authroute.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authroute.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(authroute, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(28:2) <Route path={Routes.product} let:params>",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Route path={Routes.home}>
    function create_default_slot_2(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(33:2) <Route path={Routes.home}>",
    		ctx
    	});

    	return block;
    }

    // (12:1) <ServicesProvider>
    function create_default_slot_1(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: Routes.register,
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: Routes.login,
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: Routes.pantry,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: Routes.product,
    				$$slots: {
    					default: [
    						create_default_slot_3,
    						({ params }) => ({ 0: params }),
    						({ params }) => params ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: Routes.home,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(route4, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope, params*/ 3) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(route4, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(12:1) <ServicesProvider>",
    		ctx
    	});

    	return block;
    }

    // (11:0) <Router>
    function create_default_slot(ctx) {
    	let servicesprovider;
    	let current;

    	servicesprovider = new ServicesProvider({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(servicesprovider.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(servicesprovider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const servicesprovider_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				servicesprovider_changes.$$scope = { dirty, ctx };
    			}

    			servicesprovider.$set(servicesprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(servicesprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(servicesprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(servicesprovider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(11:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Routes,
    		AuthRoute,
    		ServicesProvider,
    		Home,
    		Auth,
    		Product,
    		Pantry
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const config = {
        target: document.body,
        compilerOptions: {
            hydratable: true,
        },
    };
    const app = new App(config);

    return app;

})();
//# sourceMappingURL=bundle.js.map
