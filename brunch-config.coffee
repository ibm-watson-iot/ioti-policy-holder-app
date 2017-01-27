# This is a Brunch config file for the client application.

exports.config =
    npm:
        enabled: false

    modules:
        definition: false
        wrapper: false

    conventions:
        assets: (path) ->
            (not /\.js/.test path) and /assets(\/|\\)/.test path
        ignored: [ /((.*(\/|\\))[_].*\.scss)/,
            "bower_components/requirejs/require.js",
        ]
    files:
        javascripts:
            joinTo:
                'scripts/vendor.js': /^bower_components|^app\/vendor/
                'scripts/app.js': /^app\/app.js|^app\/scripts|^app\/assets\/pages|^app\/assets\/theme/
            order:
                before: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/jquery-ui/ui/jquery-ui.js',
                    'bower_components/lodash/lodash.js',
                    'bower_components/angular/angular.js',

                    'bower_components/amcharts/dist/amcharts/amcharts.js',
                    'bower_components/amcharts-stock/dist/amcharts/amstock.js',
                    'bower_components/moment/min/moment-with-locales.js',
                    'bower_components/ng-file-upload/ng-file-upload.js',

                    'app/vendor/'

                    'app/app.js',
                    'app/scripts/utils/',
                    'app/scripts/services/services.module.js',
                    'app/scripts/services/',

                    'app/assets/theme/components/components.module.js',
                    'app/assets/theme/inputs/inputs.module.js',
                    'app/assets/theme/theme.module.js',

                    'app/assets/pages/pages.module.js',
                    'app/assets/pages/main.module.js',

                    'app/assets/pages/charts/charts.module.js',
                    'app/assets/pages/charts/amCharts/amCharts.module.js',
                    'app/assets/pages/charts/chartist/chartist.module.js',
                    'app/assets/pages/charts/chartJs/chartJs.module.js',
                    'app/assets/pages/charts/morris/morris.module.js',
                    'app/assets/pages/components/components.module.js',
                    'app/assets/pages/components/mail/mail.module.js',
                    'app/assets/pages/components/timeline/timeline.module.js',
                    'app/assets/pages/components/tree/tree.module.js',
                    'app/assets/pages/dashboard/dashboard.module.js',

                    'app/assets/pages/form/form.module.js',
                    'app/assets/pages/form/inputs/inputs.module.js',
                    'app/assets/pages/form/layouts/layouts.module.js',
                    'app/assets/pages/form/wizard/wizard.module.js',
                    'app/assets/pages/login/login.module.js',
                    'app/assets/pages/maps/maps.module.js',
                    'app/assets/pages/profile/profile.module.js',
                    'app/assets/pages/tables/tables.module.js',
                    'app/assets/pages/ui/ui.module.js',
                    'app/assets/pages/ui/alerts/alerts.module.js',
                    'app/assets/pages/ui/buttons/buttons.module.js',
                    'app/assets/pages/ui/grid/grid.module.js',
                    'app/assets/pages/ui/icons/icons.module.js',
                    'app/assets/pages/ui/modals/modals.module.js',
                    'app/assets/pages/ui/notifications/notifications.module.js',
                    'app/assets/pages/ui/panels/panels.module.js',
                    'app/assets/pages/ui/progressBars/progressBars.module.js',
                    'app/assets/pages/ui/slider/slider.module.js',
                    'app/assets/pages/ui/tabs/tabs.module.js',
                    'app/assets/pages/ui/typography/typography.module.js',

                    'app/assets/pages/shields/shields.module.js',
                    'app/assets/pages/hazards/hazards.module.js',
                    'app/assets/pages/devices/devices.module.js'

                ]
                after: [

                ]
        stylesheets:
            joinTo:
                'styles/app.css': /^bower_components|^app\/styles\/theme|^app\/styles\/main.scss/
                'styles/auth.css': /^app\/styles\/auth.scss/

    plugins:
        uglify:
            mangle: true
            compress:
                global_defs:
                    DEBUG: false

        autoReload:
            delay: 1000

        sass:
            mode: 'native' # 'ruby' / 'native'
            options:
                includePaths: ['app/styles/**/_*.scss']

        minify: true

        autoprefixer:
            browsers: ["last 1 version", "ie 9", "ie 10"]
            cascade: false

        postcss:
            processors: [
                require('autoprefixer')(['last 8 versions'])
            ]

        afterBrunch: [
            [
               'cp bower_components/Ionicons/fonts/* public/fonts',
               'cp bower_components/font-awesome/fonts/* public/fonts',
               'mkdir -p public/img/theme/vendor/ionrangeslider/img',
               'cp bower_components/ionrangeslider/img/* public/img/theme/vendor/ionrangeslider/img'
            ].join(' && ')
        ]
