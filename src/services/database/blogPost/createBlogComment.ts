import { DatabaseBlogPost, MongooseBlogPost } from "../model/MongooseBlogPost";

type NewDatabaseBlogComment = Pick<DatabaseBlogPost["comments"][number], "authorId" | "text">;

export const createBlogComment = async (
  id: DatabaseBlogPost["_id"],
  newComment: NewDatabaseBlogComment
): Promise<DatabaseBlogPost> => {
  try {
    const updatedBlogPost = (await MongooseBlogPost.findByIdAndUpdate(
      id,
      {
        $push: { comments: newComment },
      },
      { new: true }
    ))!; // TODO remove exclamation mark

    if (updatedBlogPost === null) {
      console.log(`No blogPost found with the id '${id}'`);
      // TODO throw Error(`No blogPost found with the id '${id}'`);
    }

    console.log(`BlogPost updated with the following id: ${updatedBlogPost}`);
    return updatedBlogPost;
  } catch (error) {
    console.log("BlogPost not updated", error);
    throw error;
  }
};
