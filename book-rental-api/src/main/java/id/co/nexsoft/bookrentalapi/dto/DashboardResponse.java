package id.co.nexsoft.bookrentalapi.dto;

public class DashboardResponse {
	private long countRentalBookThisMonth;
	private long countReturnBookThisMonth;
	private long sumIncomeThisMonth;
	private long countBookOnRentalThisMonth;

	public DashboardResponse() {
	}

	public DashboardResponse(long countRentalBookThisMonth, long countReturnBookThisMonth, long sumIncomeThisMonth,
			long countBookOnRentalThisMonth) {
		this.countRentalBookThisMonth = countRentalBookThisMonth;
		this.countReturnBookThisMonth = countReturnBookThisMonth;
		this.sumIncomeThisMonth = sumIncomeThisMonth;
		this.countBookOnRentalThisMonth = countBookOnRentalThisMonth;
	}

	public long getCountRentalBookThisMonth() {
		return countRentalBookThisMonth;
	}

	public void setCountRentalBookThisMonth(long countRentalBookThisMonth) {
		this.countRentalBookThisMonth = countRentalBookThisMonth;
	}

	public long getCountReturnBookThisMonth() {
		return countReturnBookThisMonth;
	}

	public void setCountReturnBookThisMonth(long countReturnBookThisMonth) {
		this.countReturnBookThisMonth = countReturnBookThisMonth;
	}

	public long getSumIncomeThisMonth() {
		return sumIncomeThisMonth;
	}

	public void setSumIncomeThisMonth(long sumIncomeThisMonth) {
		this.sumIncomeThisMonth = sumIncomeThisMonth;
	}

	public long getCountBookOnRentalThisMonth() {
		return countBookOnRentalThisMonth;
	}

	public void setCountBookOnRentalThisMonth(long countBookOnRentalThisMonth) {
		this.countBookOnRentalThisMonth = countBookOnRentalThisMonth;
	}
}
