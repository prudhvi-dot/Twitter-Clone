import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast';


import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient} from "@tanstack/react-query";
import { parse } from "dotenv";
// import toast from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		userName: "",
		password: "",
	});

	const queryClient = useQueryClient();


	const logInFunction = async({userName,password})=>{

			const res = await fetch('/api/auth/login',{
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({userName,password})
		    });
			const parsedResponse = await res.json();
		    if(!res.ok){
			throw new Error(parsedResponse.error);
		    }
		    return parsedResponse;
		
	}

	const {mutate} = useMutation({
		mutationFn: (formData)=>logInFunction(formData),
		onSuccess: (data)=>{
			queryClient.invalidateQueries(['authUser']);
		},
		onError: (error)=>{
			toast.error(error.message);
		}
	})



	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const isError = false;

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='userName'
							onChange={handleInputChange}
							value={formData.userName}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;