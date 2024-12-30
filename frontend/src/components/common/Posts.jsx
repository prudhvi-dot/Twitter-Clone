import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
// import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";

const Posts = ({feedType}) => {

	const getPostsEndPoint = ()=>{
		switch(feedType){
			case "forYou":
				return "/api/posts/all"
			case "following":
				return "/api/posts/following"
			default:
				return "/api/posts/all"
		}
	}

	const POST_ENDPOINT = getPostsEndPoint();

	const{data:POSTS, isLoading} = useQuery({
		queryKey: ["posts", feedType],
		queryFn: async()=>{
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				
			}
		}
	})

	return (
		<>
			{isLoading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && POSTS?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && POSTS && (
				<div>
					{POSTS.map((post) => (
						<Post key={post._id} post={post} feedType={feedType} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;