<?php
/**
 * Command to insert/update hotels rating in database
 */
class ImportRatingCommand extends CConsoleCommand
{
    public function getHelp()
    {
        return <<<EOD
USAGE ImportRating path/to/csv/from/spider.csv

EOD;
    }

    public function run($args)
    {
        if (count($args)==0)
        {
            echo $this->getHelp();
            Yii::app()->end();
        }

        if (!is_readable($args[0]))
        {
            $this->logError("Given file is not readable by current user or does not exists.");
            echo $this->getHelp();
            Yii::app()->end();
        }

        Yii::import("common.modules.hotel.models.HotelRating");

        $fh = fopen($args[0], 'r');

        if($fh===FALSE)
        {
            // Should never happen in real life
            $this->logError("File exists and readable, yet i cant open it for reading.");
            echo $this->getHelp();
            exit;
        }
        // skip und check header
        $line = trim(fgets($fh));
        if($line!="rating,name,locality,url,country,name_alt,address,lat,lng,postal,address_ext")
        {
            $this->logError("Wrong fingerprint \n");
            echo $this->getHelp();
            exit;
        }

        while(!feof($fh))
        {
            $data = fgetcsv($fh);
            if($data!==false)
            {
                $rating = $this->parseRating($data[0]);
                //! Use english for canonical names
                $name = ($data[5]=="")?$data[1]:$data[5]; //mihan007: just minor thing.. what is 5 and 1? don't like magic numbers.
                $city_name=$data[2];
                $city = City::model()->guess($city_name);
                if(count($city)==0) {
                    $this->logError("Problem mapping city " . $data[2]);
                    continue;
                }
                $city = $city[0];
                $canonical_name = UtilsHelper::canonizeHotelName($name, $city->localEn);
                $this->saveRow($city->id, $canonical_name, $rating, $name);
            }
        }
    }

    /**
     * Parse rating from crawler`s raw data
     *
     * @param string $raw_rating_string "3.5 из 5"
     * @return float float representation of rating 0..5.0
     */
    public function parseRating($raw_rating_string)
    {
        $matches = Array();
        if(!preg_match("~^\d+(\.\d+)?~", $raw_rating_string, $matches)){
            $this->logError("Cant parse rating string: " .
                            $raw_rating_string);
            return false;
        };
        return floatval($matches[0]);
    }

    public function saveRow($city_id, $canonical_name, $rating, $name)
    {
        $hr = new HotelRating();
        $hr->city_id = $city_id;
        $hr->canonical_name = $canonical_name;
        $hr->rating = $rating;
        try {
            $hr->save();
        } catch (CDbException $exc) {
            $this->logError("duplicated canonical_name '"
                            . $canonical_name . " | " . $name .
                            "'");
        }
    }

    public function logError($msg)
    {
        Yii::log($msg, 'error', 'console.importrating');
    }
}
