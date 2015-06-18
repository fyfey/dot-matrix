
$(function() {
    var Font = Backbone.Model.extend({

        width: 5,
        height: 7,

        collection: fonts,

        defaults: function() {
            var data = _.range(this.height);
            _.each(data, _.bind(function(i) {
                data[i] = [];
                for(j = 0; j < this.width; j++) {
                    data[i][j] = {set: false};
                }
            }, this));

            return {
                data: data
            }
        },

        toggleCell: function(x, y) {
            var data = this.attributes.data;

            data[y][x].set = !data[y][x].set;

            this.set('data', data);
            this.trigger('change:data', this, data);
            this.trigger('change', this);
        },
    });

    var FontCollection = Backbone.Collection.extend({
        localStorage: new Backbone.LocalStorage("fonts"),
        model: Font
    });

    var HomeView = Backbone.View.extend({

        className: 'home-view',

        template: Handlebars.templates['home.hbs'],

        initialize: function(opts) {
            $('.app').html(this.el);
            this.render();
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        }
    });

    var FontEditView = Backbone.View.extend({

        className: '.font-edit',

        dragging: false,
        currentDrag: [],

        events: {
            'mousedown .cell': 'handleClick',
            'change input[data-field]': 'handleChange',
            'click button[data-action=save]': 'handleSave',
            'mousedown': 'startDrag',
            'mouseup': 'endDrag',
            'mouseover .cell': 'handleHover',
        },

        template: Handlebars.templates['font-edit.hbs'],

        initialize: function(opts) {
            this.model = opts.model;
            this.listenTo(this.model, 'change:data', this.render);

            $('body').html(this.el);
            this.render();
        },

        handleChange: function(e) {
            var $el = $(e.currentTarget),
                field = $el.data('field');

            this.model.set(field, $el.val());
        },

        handleClick: function(e) {
            e.preventDefault();
            var $el = $(e.currentTarget),
                x = $el.data('x'),
                y = $el.data('y');

            this.model.toggleCell(x, y);
            this.currentDrag.push(x+':'+y);
            this.startDrag(e);
        },

        handleHover: function(e) {
            var $el = $(e.currentTarget),
                x = $el.data('x'),
                y = $el.data('y');

            if (this.dragging && !_.contains(this.currentDrag, x+':'+y)) {
                this.currentDrag.push(x+':'+y);
                this.model.toggleCell(x, y);
            }
        },

        startDrag: function(e) {
            if (e.which === 1) {
                this.dragging = true;
            }
        },

        endDrag: function(e) {
            if (e.which === 1) {
                this.dragging = false;
                this.currentDrag = [];
            }
        },

        handleSave: function() {
            if (!this.model.has('name')) {
                return alert("Enter letter");
            }
            fonts.add(this.model);
            this.model.save();

            router.navigate('fonts', {trigger: true});
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }

    });

    FontListView = Backbone.View.extend({

        className: '.font-list',

        template: Handlebars.templates['font-list.hbs'],

        initialize: function(opts) {
            this.collection = opts.collection;

            $('body').html(this.el);
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.collection.toJSON()));
            return this;
        }

    });
    var fonts = new FontCollection();

    Router = Backbone.Router.extend({

        currentView: null,

        routes: {
            '': 'home',
            'home':  'home',
            'fonts': 'fonts',
            'font/new': 'newFont',
            'font/:id/edit': 'editFont',
            'font/:id/delete': 'deleteFont',
            'messages': 'messages',
            'message/new': 'newMessage',
            'message/:id/edit': 'editMessage',
            'message/:id/delete': 'deleteMessage',
        },

        initialize: function() {
            this.navigate('home');
        },

        home: function() {
            this._loadView(new HomeView());
        },

        fonts: function() {
            fonts.fetch().then(_.bind(function() {
                this._loadView(new FontListView({collection: fonts}));
            },this));
        },

        newFont: function() {
            this._loadView(new FontEditView({model: new Font}));
        },

        editFont: function(id) {
            fonts.fetch().then(_.bind(function() {
                this._loadView(new FontEditView({model: fonts.get(id)}));
            }, this));
        },

        deleteFont: function(id) {
            var font = new Font({id: id});
            font.delete();

            router.navigate('fonts', {trigger: true});
        },

        _loadView: function(view, args) {
            this.currentView && this.currentView.remove();
            this.currentView = view;
        }

    });

    router = new Router();

    Backbone.history.start();
});
