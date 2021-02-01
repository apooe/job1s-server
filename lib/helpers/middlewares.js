/**
 * Middlewares avec des parametres
 * @param field
 * @param schema
 * @returns {function(*, *, *): Promise<*>}
 */
// Pour les paramatre
const validate = (field, schema) => {
    // return nun middleware
    return async (req, res, next) => {
        console.log("COPAIn");
        try {
            const toValidate = req[field];
            const isValid = await schema.validate(toValidate);
            if(isValid) {
                console.log("VALID");

                return next();
            }
        }catch (e) {
            console.log(e);
            return res.status(400).json(e.errors);
        }
    }
}

module.exports = {validate};
