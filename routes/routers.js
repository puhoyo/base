const fs = require('fs');

exports.routerInit = () => {
    return new Promise(resolve => {
        fs.readdir(__dirname, (err, files) => {
            const routerNames = [];
            for (let i in files) {
                const split = files[i].split('.');
                const routerName = split[0];
                const extension = split[1];
                if (extension === 'js' && !(routerName === 'routers' || routerName === 'middlewares')) {
                    routerNames.push(routerName);
                }
            }

            const routers = {};
            routerNames.forEach(routerName => {
                const url = `/${routerName}`;
                const router = require(__dirname + `/${routerName}`);

                routers[url === '/index' ? '/' : url] = router;
            });

            resolve(routers);
        });
    });
}