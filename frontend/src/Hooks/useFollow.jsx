import { useMutation, useQueryClient } from "@tanstack/react-query";
import {toast} from 'react-hot-toast';

export default function useFollow() {

    const queryClient = useQueryClient();

    const{mutate:follow, isLoading} = useMutation({
        mutationFn: async(userId)=>{
                const res = await fetch(`/api/users/follow/${userId}`,{
                    method: "POST"
                });
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.error);
                }
                return data;

        },
        onSuccess: ()=>{
            toast.success('Followed')
            Promise.all([
               queryClient.invalidateQueries(['suggested']),
               queryClient.invalidateQueries(['authUser'])
            ])
        },
        onError: (error)=>{
            toast.error(error.message);
        }

    })

    return {follow, isLoading}
}