import { NextApiRequest, NextApiResponse } from 'next'

export default (_: NextApiRequest, res: NextApiResponse) => {
    res.status(200).json({ text: 'Hello' })
}


//JS
// req = HTTP incoming message, res = HTTP sever response
// export default function handler(req, res) {
//     res.status(200).json({ text: 'Hello' })
// }