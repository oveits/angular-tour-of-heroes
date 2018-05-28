SOURCE_PREFIX=$1
DESTINATION_PREFIX=$2

clone(){
  for SOURCE in $SOURCE_PREFIX* 
  do
    # extract tail:
    start=$(expr ${#SOURCE_PREFIX} + 1)
    stop=${#SOURCE}
    echo start=$start
    echo stop=$stop
    TAIL=$(echo ${SOURCE} | cut -c "$start-$stop")
    DESTINATION=${DESTINATION_PREFIX}${TAIL}

    # copy file:

    cp ${SOURCE} ${DESTINATION}

    # replacements:
    # spinal case:
    #SOURCE_PREFIX_ESCAPED=$(echo ${SOURCE_PREFIX} | sed 's/\//\\\//g')
    #DESTINATION_PREFIX_ESCAPED=$(echo ${DESTINATION_PREFIX} | sed 's/\//\\\//g')
    SOURCE_PATTERN=$(echo ${SOURCE_PREFIX} | sed 's/^.*\///')
    customer=$(echo ${DESTINATION_PREFIX} | sed 's/^.*\///')
    sed -i "s/${customer}/customer/g" ${DESTINATION}
    sed -i "s/${SOURCE_PATTERN}/${customer}/g" ${DESTINATION}

    # CamelCase patterns (from https://stackoverflow.com/questions/34420091/spinal-case-to-camel-case):
    SOURCE_PATTERN_CAMEL_CASE=$(echo $SOURCE_PATTERN | sed -r 's/(^|-)(\w)/\U\2/g')
    customer_CAMEL_CASE=$(echo $customer | sed -r 's/(^|-)(\w)/\U\2/g')
    #sed -i "s/${customer_CAMEL_CASE}/customer_CAMEL_CASE/g" ${DESTINATION}
    sed -i "s/${SOURCE_PATTERN_CAMEL_CASE}/${customer_CAMEL_CASE}/g" ${DESTINATION}

    # small camelCase patterns
    SOURCE_PATTERN_CAMEL_CASE_SMALL=$(echo $SOURCE_PATTERN_CAMEL_CASE | sed -r 's/(^)(\w)/\L\2/g')
    customer_CAMEL_CASE_SMALL=$(echo $customer_CAMEL_CASE | sed -r 's/(^)(\w)/\L\2/g')
    echo SOURCE_PATTERN_CAMEL_CASE_SMALL=$SOURCE_PATTERN_CAMEL_CASE_SMALL
    echo SOURCE_PATTERN_CAMEL_CASE_SMALL=$SOURCE_PATTERN_CAMEL_CASE_SMALL
    echo customer_CAMEL_CASE_SMALL=$customer_CAMEL_CASE_SMALL
    #sed -i "s/${customer_CAMEL_CASE_SMALL}/customer_CAMEL_CASE_SMALL/g" ${DESTINATION}
    sed -i "s/${SOURCE_PATTERN_CAMEL_CASE_SMALL}/${customer_CAMEL_CASE_SMALL}/g" ${DESTINATION}

    # small letters
    SOURCE_PATTERN_SMALL=$(echo ${SOURCE_PREFIX} | sed 's/-//g')
    customer_SMALL=$(echo ${DESTINATION_PREFIX} | sed 's/-//g')
    echo SOURCE_PATTERN_SMALL=$SOURCE_PATTERN_SMALL
    echo customer_SMALL=$customer_SMALL
    #sed -i "s/${customer_SMALL}/customer_SMALL/g" ${DESTINATION}
    sed -i "s/${SOURCE_PATTERN_SMALL}/${customer_SMALL}/g" ${DESTINATION}

    
  done
}

clone
