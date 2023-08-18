const {
  getArticles,
  getArticleById,
  patchArticleById,
  postArticles,
  deleteArticleById,
} = require("../../controllers/api/articles-controller");

const {
  getComments,
  postComment,
} = require("../../controllers/api/comments-controller");
const { verifyJWT } = require("../../middleware/verifyJWT");

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticles).post(postArticles);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(verifyJWT, deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;