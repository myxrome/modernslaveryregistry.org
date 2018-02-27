require 'csv'

module Admin
  class BulkUploadsController < AdminController
    def create
      csv_io = params[:csv]
      return alert_csv if csv_io.nil?

      statement_params_array = CSV.parse(csv_io.read, headers: :first_row).map(&:to_hash)
      imported = bulk_create(statement_params_array)
      flash[:notice] = "Imported #{imported} statements"

      redirect_to admin_dashboard_path
    end

    def alert_csv
      flash[:alert] = 'Please select a CSV file'
      redirect_to admin_dashboard_path
    end

    def bulk_create(statement_params_array)
      before = Statement.count
      statement_params_array.each do |statement_params|
        Statement.bulk_create!(statement_params['company_name'], statement_params['statement_url'])
      end
      Statement.count - before
    end
  end
end