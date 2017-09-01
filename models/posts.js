
var mongodb = require('./db');

function Post(name,title,post,img,docClass){
	this.name = name;
	this.title = title;
	this.post = post;
	this.img = img;
	this.docClass = docClass;
}

module.exports = Post;

Post.prototype.save = function(callback){
	var date = new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear() + "-" + (date.getMonth()+1),
		day:date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
		minute:date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() +" "+
				date.getHours() + ":" + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	};
	var post = {
		name:this.name,
		time:time,
		title:this.title,
		post:this.post,
		img:this.img,
		docClass:this.docClass,
		comments:[],
		pv:0
	}
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(post,{
				safe:true
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}

Post.getTen = function(name,page,callback){
	mongodb.open(function(err,db){
		if(err){
			console.log(err)
			return callback(err);
		}
		db.authenticate("test","test",function () {
            db.collection('posts',function(err,collection){

                if(err){
                	console.log(err)
                    mongodb.close();
                    return callback(err);
                }
                var query = {};
                if(name){
                    query.name = name;
                }
                collection.count(query,function(err,total){
                    collection.find(query,{
                        skip:(page-1)*10,
                        limit:10
                    }).sort({
                        time:-1
                    }).toArray(function(err,docs){
                        mongodb.close();
                        if(err){
                            return callback(err);
                        }
                        docs.forEach(function (doc) {
                            doc.post = markdown.toHTML(doc.post);
                        });
                        callback(null,docs,total);
                    });
                });
            })
        })

	});

}

Post.getOne = function(name,day,title,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title
			},function(err,doc){
				if(err){
					mongodb.close();
					return callback(err);
				}
				if(doc){
					collection.update({
						"name":name,
						"time.day":day,
						"title":title
					},{
						$inc:{"pv":1}
					},function(err){
						if(err){
							return callback(err);
						}
					});
					doc.post = markdown.toHTML(doc.post);
					callback(null,doc);
				}
			});
		});
	});

}

Post.edit = function(name,day,title,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title
			},function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
			});
		});

	});

}

Post.update = function(name,day,title,post,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({
				"name":name,
				"time.day":day,
				"title":title
			},{
				$set:{
					post:post.doc,
					title:post.title,
					img:post.img,
					time:post.time,
					docClass:post.docClass
				}
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}

Post.remove = function(name,day,title,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.remove({
				"name":name,
				"time.day":day,
				"title":title
			},{
				w:1
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}

Post.getHistory = function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find({
				"name":name
			},{
				"name":1,
				"time":1,
				"title":1
			}).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}

Post.getClasses = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.distinct('docClass',function(err,classes){
				if(err){
					return callback(err);
				}
				callback(null,classes);
			});
		});
	});
}

Post.getClass = function(docClass,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("posts",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find({
				docClass:docClass
			},{
				name:1,
				time:1,
				title:1
			}).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}

Post.search = function(keyword,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("posts",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var pattern = new RegExp(keyword, "i");
			collection.find({
				$or:[{title:pattern},{post:pattern}]
			},{
				name:1,
				time:1,
				title:1
			}).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs)
			});
		});
	});

}