package id.co.nexsoft.bookrentalapi.util;

import java.util.Locale;
import java.text.NumberFormat;

public class CurrencyToRupiahUtil {
	
	public static String currencyID(long amount){
	    Locale localeID = new Locale("in", "ID");
	    NumberFormat formatRupiah = NumberFormat.getCurrencyInstance(localeID);
	    return formatRupiah.format((long)amount);
	}
}
