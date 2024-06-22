import { check } from 'express-validator';
import jwt from 'jsonwebtoken';

 const checkAdmin =(req, res, next)=>{
    const token = (req.headers.authorization ||'').replace(/Bearer\s?/,'');
    if(token){
        try{
            const decoded = jwt.verify(token,'key123') 
                req.role = decoded.role;
                next();        

        }catch(e){
            return res.status(403).json({
                message: 'No access',
            });
        }
    }else{
       return res.status(403).json({
            message: 'No access',
        });
    }

}
export default checkAdmin;