import { Request, Response } from 'express'
import User from '../models/User';
export async function logOut(req: Request, res: Response,) {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) {
        console.log('no jwt cookie')
        return res.sendStatus(204);} //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    console.log(foundUser);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    res.status(204);
    console.log(`Successfully logged out user: ${result}`);

}
