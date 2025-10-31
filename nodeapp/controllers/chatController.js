const Material = require('../models/materialModel');
const axios = require('axios')

async function handlechat(req, res) {
    try {
        const { courseId, sessionId } = req.params
        const { prompt } = req.body

        const materials = await Material.find({ courseId })
        const material = materials.map(item => {
            return `${item.title} - ${item.description}`
        }).join()

        const sysPrompt = `You are an expert Course based Q&A system. Based on MATERIAL provided cureate your answer to resolve users query and make then understand the course better. If context is not sufficient then you can respond with some basic knowledge about asked question. Try to respond in point structure when required fo student to have better readability`
        const fullPrompt = `${sysPrompt}\n\nMATERIAL:\n${material}\n\nUSER QUESTION: ${prompt}`
        console.log(fullPrompt)

        const response = await axios.post(`https://8080-bcbbacbefacebaaeddaecfacbefecac.premiumproject.examly.io/chat/custome/${sessionId}/${courseId}`, { prompt: prompt, context: fullPrompt })
        console.log('Resposne', response)
        res.status(200).json(response.data)
    } catch (error) {
        res.status(500).json({ message: 'Error generating resposne' })
    }
}

module.exports = {
    handlechat
}