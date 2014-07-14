// var path = require('path'),
// 	passport = require('passport');

module.exports = function(periodic){
	// express,app,logger,config/settings,db
	var periodicController = require('../../../../app/controller/periodic')(periodic),
			homeController = require('../../../../app/controller/home')(periodic),
			postController = require('../../../../app/controller/post')(periodic),
			tagController = require('../../../../app/controller/tag')(periodic),
			categoryController = require('../../../../app/controller/category')(periodic),
			contenttypeController = require('../../../../app/controller/contenttype')(periodic),
			userController = require('../../../../app/controller/user')(periodic),
			searchController = require('../../../../app/controller/search')(periodic),
			collectionController = require('../../../../app/controller/collection')(periodic),
			themeController = require('../../../../app/controller/theme')(periodic),
			postRouter = periodic.express.Router(),
			browseRouter = periodic.express.Router(),
			tagRouter = periodic.express.Router(),
			collectionRouter = periodic.express.Router(),
			categoryRouter = periodic.express.Router(),
			searchRouter = periodic.express.Router(),
			contenttypeRouter = periodic.express.Router(),
			userRouter = periodic.express.Router(),
			appRouter = periodic.express.Router();

	/**
	 * root routes
	 */
	appRouter.get('/articles|/posts',postController.loadPosts,postController.index);
	appRouter.get('/collections',collectionController.loadCollections,collectionController.index);
	appRouter.get('/404|/notfound',homeController.error404);
	appRouter.get('/search',searchController.browse,searchController.results);

	/**
	 * documentpost-articles routes
	 */
	postRouter.get('/search',postController.loadPosts,postController.index);
	postRouter.get('/:id',postController.loadPost,postController.show);

	/**
	 * collections
	 */
	collectionRouter.get('/search',collectionController.loadCollections,collectionController.index);
	collectionRouter.get('/:id/page/:pagenumber',collectionController.loadCollection,collectionController.show);
	collectionRouter.get('/:id',collectionController.loadCollection,collectionController.show);

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
	
	appRouter.get('/author/:id',userController.loadUser,userController.show);

	/**
	 * browse/search
	 */
	browseRouter.get('/:entitytype/:entityitems',searchController.browsefilter,searchController.browse,searchController.index);
	browseRouter.get('/:entitytype',searchController.browsetags,searchController.browsefilter,searchController.browse,searchController.index);

	/**
	 * final root routes
	 */
	appRouter.get('/install/getlog',homeController.get_installoutputlog);
	// appRouter.get('/',postController.loadPosts,homeController.index);
	appRouter.get('/',function(req,res,next){
		themeController.customLayout({
			req:req,
			res:res,
			next:false,
			viewpath:'home/index',
			layoutdata:{
				categories:{
					model:'Category',
					search:{
						query:req.params.cat,sort:'-createdat',limit:10,offset:0
					}
				},
				docs:{
					model:'Post',
					search:{
						query:req.params.post,sort:'-createdat',limit:10,offset:0,population:'authors primaryauthor'
					}
				},
				collections:{
					model:'Collection',
					search:{
						query:req.params.post,sort:'-createdat',limit:10,offset:0
					}
				},
				tags:{
					model:'Tag',
					search:{
						query:req.params.post,sort:'-createdat',limit:10,offset:0
					}
				},
				authors:{
					model:'User',
					search:{
						query:req.params.post,sort:'-createdat',limit:10,offset:0
					}
				},
				contenttypes:{
					model:'Contenttype',
					search:{
						query:req.params.post,sort:'-createdat',limit:10,offset:0
					}
				}
			}
		});
	});

	periodic.app.use('/post|/article|/document',postRouter);
	periodic.app.use('/tag',tagRouter);
	periodic.app.use('/category',categoryRouter);
	periodic.app.use('/collection',collectionRouter);
	periodic.app.use('/user',userRouter);
	periodic.app.use('/contenttype',contenttypeRouter);
	periodic.app.use('/browse',browseRouter);
	periodic.app.use(appRouter);
};