
// Backbone.sync = function(method, model) {
//     console.log("method", method, "model", model);
// 
//     model.id = 1;
// };

Font = Backbone.Model.extend({

    width: 5,
    height: 7,

    url: "fonts",

    initialize: function() {
        var data = _.range(this.height);
        _.each(data, _.bind(function(i) {
            data[i] = [];
            for(j = 0; j < this.width; j++) {
                data[i][j] = {set: false};
            }
        }, this));

        this.set('data', data);

        console.log(this);
    },

    toggleCell: function(x, y) {
        var data = this.attributes.data;

        if (data[y][x].set) {
            data[y][x].set = false;
        } else {
            data[y][x].set = true;
        }

        this.set('data', data);
        this.trigger('change:data', this, data);
    },
});
Fonts = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("Fonts"),
    model: Font
});

HomeView = Backbone.View.extend({

    el: '.app',

    template: Handlebars.templates['home.hbs'],

    render: function() {
        this.$el.html(this.template());
    }
});

FontEditView = Backbone.View.extend({

    el: '.app',

    events: {
        'click .cell': 'handleClick',
        'change input[data-field]': 'handleChange',
        'click button[data-action=save]': 'handleSave'
    },

    template: Handlebars.templates['font-edit.hbs'],

    initialize: function(opts) {
        this.model = opts.model;
        console.log("model", this.model);
        this.listenTo(this.model, 'change:data', this.render);
    },

    handleChange: function(e) {
        console.log("handleChange");
        var $el = $(e.currentTarget),
            field = $el.data('field');

        console.log("el", $el);

        this.model.set(field, $el.val());
    },

    handleClick: function(e) {
        var $el = $(e.currentTarget),
            x = $el.data('x'),
            y = $el.data('y');

        this.model.toggleCell(x, y);
    },

    handleSave: function() {
        this.model.save();
    },

    render: function() {
        console.log("render", this.model.toJSON());
        this.$el.html(this.template(this.model.toJSON()));
    }

});

FontListView = Backbone.View.extend({

    el: '.app',

    template: Handlebars.templates['font-list.hbs'],

    initialize: function(opts) {
        this.collection = opts.collection;
    },

    render: function() {
        this.$el.html(this.template(this.collection.toJSON()));
    }

});

Router = Backbone.Router.extend({

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
        this.fonts = new Fonts();
    },

    home: function() {
        var view = new HomeView();
        view.render();
    },

    fonts: function() {
        this.fonts.fetch();

        var view = new FontListView({collection: this.fonts});
        view.render();
    },

    newFont: function() {
        var font = new Font();
        this.fonts.add(font);
        var view = new FontEditView({model: font});
        view.render();
    },

    editFont: function(id) {
        console.log("editFont", id);
        this.fonts
            .fetch()
            .then(_.bind(function() {
                var font = this.fonts.get(id);
                font.fetch();
                var view = new FontEditView({model: font});
                view.render();
            }, this));
    }

});

router = new Router();

Backbone.history.start();
