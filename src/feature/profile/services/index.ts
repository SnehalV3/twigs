import axios from "axios"
import {useQuery} from '@tanstack/react-query'

export const getProfileData = ()=>{
    return axios.get('/api/get-profile').then((res)=>{
       return res.data.data
    })
}

export const updateProfileData = (newProfile) =>{
    
    return axios.post('/api/update-profile',newProfile).then((res)=>{
        return res.data.data
    })
}

export const useGetProfileData = () =>{
    return useQuery(['profileData'], ()=>getProfileData(),{
        refetchOnWindowFocus:false
    })
}
