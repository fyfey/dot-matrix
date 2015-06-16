
Backbone.sync = function(method, model) {
    console.log("method", method, "model", model);

    model.id = 1;
};

Font = Backbone.Model.extend({});
Fonts = Backbone.Collection.extend({
    model: Font
});

HomeView = Backbone.View.extend({

    el: '.app',

    template: Handlebars.templates['home.hbs'],

    render: function() {
        console.log("render");
        this.$el.html(this.template());
    }
});

FontEditView = Backbone.View.extend({

    template: Handlebars.templates['font-edit.hbs'],

    initialize: function() {
        console.log("font edit!");
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
    },

    home: function() {
        view = new HomeView();
        view.render();
    },

    fontEdit: function() {

    }

});

router = new Router();

Backbone.history.start();
