import { DatabaseBlogPost, IBlogPost } from "../model/DatabaseBlogPost";

type NewDatabaseBlogPost = Pick<
  IBlogPost,
  "authorId" | "title" | "text" | "bannerImage" | "destinations" | "topics"
>;

export const createBlogPost = async (newUser: NewDatabaseBlogPost): Promise<IBlogPost> => {
  try {
    const createdBlogPost = await DatabaseBlogPost.create(newUser);

    console.log(`New blogPost created with the following id: ${createdBlogPost}`);
    return createdBlogPost;
  } catch (error) {
    console.log("No new blogPost created", error);
    throw error;
  }
};