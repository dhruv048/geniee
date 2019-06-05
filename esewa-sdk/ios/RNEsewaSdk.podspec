
Pod::Spec.new do |s|
  s.name         = "RNEsewaSdk"
  s.version      = "1.0.0"
  s.summary      = "RNEsewaSdk"
  s.description  = <<-DESC
                  RNEsewaSdk
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNEsewaSdk.git", :tag => "master" }
  s.source_files  = "RNEsewaSdk/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  