// req = HTTP incoming message, res = HTTP sever response
export default function handler(req, res) {
    res.status(200).json({ text: 'Hello' })
}