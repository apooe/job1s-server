const {Client, PlaceAutocompleteType} = require("@googlemaps/google-maps-services-js");
const config = require('../../config');

const placesClient = new Client({});

const placeAutoComplete = async (city) => {
    try{
        const result = await placesClient.placeAutocomplete({
            params:{
                input: city,
                types: PlaceAutocompleteType.cities,
                key:config.google.placeApiKey
            },
        });
        const formatted = await result.data.predictions.map(predict => predict.description);
        console.log(formatted);
        return formatted;

    }catch(e){
     console.log(e);
    }
}

module.exports = {
    placeAutoComplete,
};