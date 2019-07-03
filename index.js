/**
 * Function rapper to send JS Object via Fetch post
 * @param data { object } - What we need to send
 * @param url - { string } - Url where we need to send, if not present, will sent to current base url
 * @returns { Promise<Response> } - JSON response parsed to JS object
 */

function ajaxPost( data = {}, url = undefined ) {

    if ( typeof url === 'undefined' )    {
        url = location.protocol + '//' + location.hostname;
    }

    let requestData;

    if ( typeof data === 'object') {
        requestData = objectToUrlParamsRecursive( data );
    }

    console.log('Sending to ' + url + ' \nthis data: \n' + requestData );

    return fetch( url, {
        method: 'POST',
        // mode: '*same-origin',
        // credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        // referrer: '*client',
        body: requestData
    }).then( function ( response ) {
        return response.json();
    });

}

/**
 * Recursive function which convert JS Object for application/x-www-form-urlencoded content-type string
 * @param obj { object } - May be with inner objects
 * @param url_params { string | boolean } - If call recursive, previously generated string, else false.
 * @param namespace { string | boolean } - If call recursive, namespace key;
 * @returns {string} - for Content type: application/x-www-form-urlencoded
 */
function objectToUrlParamsRecursive( obj, url_params = false, namespace = false ) {

    let urlParams = url_params ? url_params : '';
    let DataKey;

    obj.forEach( function ( key, val ) {

        DataKey = namespace ? namespace + '[' + key + ']' : key;

        if( typeof val === 'object' && !( val instanceof File ) ) {
            urlParams = objectToUrlParamsRecursive( val, urlParams, DataKey );
        } else {
            if ( urlParams === '' ) {
                urlParams = urlParams + DataKey + '=' + val.toString();
            } else {
                urlParams = urlParams + '&' + DataKey + '=' + val.toString();
            }

        }

    });

    return urlParams;

}