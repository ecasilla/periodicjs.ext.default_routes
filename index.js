'use strict';
var path = require('path');

/**
 * A simple extension that adds basic routes to periodic resources
 * @{@link https://github.com/typesettin/periodic}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @exports periodicjs.ext.default_routes
 * @requires module:path
 * @param  {object} periodic variable injection of resources from current periodic instance
 */
module.exports = function (periodic) {
	// express,app,logger,config/settings,db
	var homeController = require(path.resolve(process.cwd(), './app/controller/home'))(periodic),
		itemController = require(path.resolve(process.cwd(), './app/controller/item'))(periodic),
		assetController = require(path.resolve(process.cwd(), './app/controller/asset'))(periodic),
		// tagController = require(path.resolve(process.cwd(),'./app/controller/tag'))(periodic),
		// categoryController = require(path.resolve(process.cwd(),'./app/controller/category'))(periodic),
		// contenttypeController = require(path.resolve(process.cwd(),'./app/controller/contenttype'))(periodic),
		userController = require(path.resolve(process.cwd(), './app/controller/user'))(periodic),
		searchController = require(path.resolve(process.cwd(), './app/controller/search'))(periodic),
		collectionController = require(path.resolve(process.cwd(), './app/controller/collection'))(periodic),
		compilationController = require(path.resolve(process.cwd(), './app/controller/compilation'))(periodic),
		themeController = require(path.resolve(process.cwd(), './app/controller/theme'))(periodic),
		assetRouter = periodic.express.Router(),
		itemRouter = periodic.express.Router(),
		browseRouter = periodic.express.Router(),
		tagRouter = periodic.express.Router(),
		collectionRouter = periodic.express.Router(),
		compilationRouter = periodic.express.Router(),
		categoryRouter = periodic.express.Router(),
		// searchRouter = periodic.express.Router(),
		contenttypeRouter = periodic.express.Router(),
		userRouter = periodic.express.Router(),
		appRouter = periodic.express.Router();

	/**
	 * root routes
	 */
	appRouter.get('/assets', assetController.loadAssetWithCount, assetController.loadAssetWithDefaultLimit, assetController.loadAssets, assetController.index);
	appRouter.get('/items', itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, itemController.index);
	// appRouter.get('/articles', itemController.loadItems, itemController.index);
	appRouter.get('/collections', collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, collectionController.index);
	appRouter.get('/compilations', compilationController.loadCompilationsWithCount, compilationController.loadCompilationsWithDefaultLimit, compilationController.loadCompilations, compilationController.index);
	appRouter.get('/authors', userController.loadUsersWithCount, userController.loadUsersWithDefaultLimit, userController.loadUsers, userController.index);
	appRouter.get('/404|/notfound', homeController.error404);
	appRouter.get('/search', searchController.browse, searchController.results);

	/**
	 * assets routes
	 */
	assetRouter.get('/search', assetController.loadAssetWithCount, assetController.loadAssetWithDefaultLimit, assetController.loadAssets, assetController.index);
	assetRouter.get('/:id', assetController.loadAsset, assetController.show);

	/**
	 * item-articles routes
	 */
	itemRouter.get('/search', itemController.loadItemsWithCount, itemController.loadItemsWithDefaultLimit, itemController.loadItems, itemController.index);
	itemRouter.get('/:id', itemController.loadFullItem, itemController.show);

	/**
	 * collections
	 */
	collectionRouter.get('/search', collectionController.loadCollectionsWithCount, collectionController.loadCollectionsWithDefaultLimit, collectionController.loadCollections, collectionController.index);
	collectionRouter.get('/:id/page/:pagenumber', collectionController.loadCollection, collectionController.show);
	collectionRouter.get('/:id', collectionController.loadCollection, collectionController.show);

	/**
	 * compilations
	 */
	compilationRouter.get('/search', compilationController.loadCompilationsWithCount, compilationController.loadCompilationsWithDefaultLimit, compilationController.loadCompilations, compilationController.index);
	compilationRouter.get('/:id/page/:pagenumber', compilationController.loadCompilation, compilationController.show);
	compilationRouter.get('/:id', compilationController.loadCompilation, compilationController.show);

	/**
	 * tags
	 */

	/**
	 * categories
	 */

	/**
	 * content types
	 */

	/**
	 * authors
	 */
	appRouter.get('/author/:id', userController.loadUser, userController.show);
	/**
	 * browse/search
	 */
	browseRouter.get('/:entitytype/:entityitems', searchController.browsefilter, searchController.browse, searchController.index);
	browseRouter.get('/:entitytype', searchController.browsetags, searchController.browsefilter, searchController.browse, searchController.index);

	/**
	 * final root routes
	 */
	appRouter.get('/install/getlog', homeController.get_installoutputlog);
	// appRouter.get('/',itemController.loadItems,homeController.index);
	appRouter.get('/', function (req, res) {
		themeController.customLayout({
			req: req,
			res: res,
			next: false,
			viewpath: 'home/index',
			layoutdata: {
				categories: {
					model: 'Category',
					search: {
						query: req.params.cat,
						sort: '-createdat',
						limit: 10,
						offset: 0
					}
				},
				docs: {
					model: 'Item',
					search: {
						query: req.params.item,
						sort: '-createdat',
						limit: 10,
						offset: 0,
						population: 'authors primaryauthor'
					}
				},
				collections: {
					model: 'Collection',
					search: {
						query: req.params.item,
						sort: '-createdat',
						limit: 10,
						offset: 0
					}
				},
				compilations: {
					model: 'Compilation',
					search: {
						query: req.params.item,
						sort: '-createdat',
						limit: 10,
						offset: 0
					}
				},
				tags: {
					model: 'Tag',
					search: {
						query: req.params.item,
						sort: '-createdat',
						limit: 10,
						offset: 0
					}
				},
				authors: {
					model: 'User',
					search: {
						query: req.params.item,
						sort: '-createdat',
						limit: 10,
						offset: 0
					}
				},
				contenttypes: {
					model: 'Contenttype',
					search: {
						query: req.params.item,
						sort: '-createdat',
						limit: 10,
						offset: 0
					}
				}
			}
		});
	});

	periodic.app.use('/asset', assetRouter);
	periodic.app.use('/item', itemRouter);
	periodic.app.use('/tag', tagRouter);
	periodic.app.use('/category', categoryRouter);
	periodic.app.use('/collection', collectionRouter);
	periodic.app.use('/compilation', compilationRouter);
	periodic.app.use('/user', userRouter);
	periodic.app.use('/contenttype', contenttypeRouter);
	periodic.app.use('/browse', browseRouter);
	periodic.app.use(appRouter);
};
