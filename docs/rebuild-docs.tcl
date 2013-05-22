#!/usr/bin/tclsh
#| Script to Create Docs 
# Create page for each proc using proc_doc

package require qcode

proc subfirst {_varName sub_string {else_sub_string ""}} {
    upvar $_varName _list
    if { [info exists _list] && [llength $_list] > 0 } {
        set $_varName [lindex $_list 0]
        return [subst $sub_string]
    } else {
        return [subst $else_sub_string]
    }
}

proc subeach {_varName _list sub_string} {
    #| Template substitution, run subst on string for each item in list.
    # Can be used recursively, eg. [subeach item $list "li: [subeach item $item $sub_string] :/li"]
    set _result ""
    foreach $_varName $_list {
        append _result [subst $sub_string]
    }
    return $_result
}

proc markdown_parse_meta_data {markdown} {    
    #| Return qc::multimap containing meta data key and values
    set meta_data_multimap {}
    if { [regexp -indices -nocase {^(?:[-_a-zA-Z0-9]+:.*\n\n){1,1}?} $markdown indices] } {
        set meta_data [string range $markdown [lindex $indices 0] [lindex $indices 1]]
        
        # Parse meta data
        # Store each key and list of corresponding values in a dict 
        foreach line [split $meta_data \n] {
            if { [regexp {^([-_a-zA-Z0-9]+):(.*)$} $line -> key value] } {
                # New Key and Value Found
                regsub {(^\s+)|(\s+$)} $value "" value
                lappend meta_data_multimap [qc::lower $key] $value
            } elseif { [regexp {^\s{4}\s*(.*)$} $line -> value] } {
                # Addtional Value for the Current Key
                regsub {(^\s+)|(\s+$)} $value "" value
                lappend meta_data_multimap [qc::lower $key] $value
            }
        }
    }
    return $meta_data_multimap
}

proc markdown_strip_meta_data {markdown} {    
    #| Return markdown stripped of any mutimap meta data.
    return [regsub -nocase {^(?:[-_a-zA-Z0-9]+:.*\n\n){1,1}?} $markdown ""]
}

proc markdown2html {markdown} {
    #| Return HTML.
    #| Strip out any meta data in the markdown. (eg CSS: and TITLE: )
    #| Convert Github Flavoured Markdown to HTML.
    set markdown [markdown_strip_meta_data $markdown]
    return [exec ruby /var/lib/gems/1.8/gems/github-markdown-0.5.3/bin/gfm << $markdown]
}

proc html_template {template_dir markdown page_url copyright} {
    #| Return HTML document.
    #| Parse meta data in markdown. CSS and TITLE metadata 
    #| Convert Github Flavoured Markdown to HTML.
    set copyright [list $copyright]
    set meta_data_multimap [markdown_parse_meta_data $markdown]
    foreach key [qc::multimap_keys $meta_data_multimap] {
        set $key [qc::multimap_get_all $meta_data_multimap $key]
    }
    qc::default js {}
    qc::default css {}

    if { [info exists template] } {
        set template [read [set handle [open "${template_dir}/[lindex $template 0]"]]]
    } else {
        set template [read [set handle [open "${template_dir}/default.html"]]]
    }
    close $handle

    set page_url [list $page_url]

    set content [list [markdown2html $markdown]]

    return [subst $template]
}

proc find_files {root file_extensions} {
    # Return a list of paths for every file under this root matching the given file extensions
    set files [glob -nocomplain  -dir $root -type f *{[join $file_extensions ,]}]
    lappend files {*}[glob -nocomplain  -dir $root -types {f hidden} *{[join $file_extensions ,]}]
    foreach dir [glob -nocomplain -directory $root -type d  *] {
        lappend files {*}[find_files $dir $file_extensions]
    }
    return $files
}

proc make_docs {src_dir template_dir out_dir url_root copyright_html} {
    #| Recursively build documentation from source directory, preserving source directory structure.
    #| Convert any Markdown files to HTML
    file mkdir ${out_dir}
    foreach src_filename [glob -nocomplain  -dir $src_dir -type f *] {
        if { [regexp {.md$} $src_filename] } {
            # Read markdown files and convert to HTML
            set page_url [regsub "^$src_dir/" [file rootname $src_filename].html $url_root]
            set html [html_template $template_dir [read [set handle [open $src_filename]]] $page_url $copyright_html]
            close $handle
            
            # Write HTML files
            set html_filename [regsub "^$src_dir" [file rootname $src_filename].html $out_dir]
            set handle [open $html_filename w 00666]
            puts -nonewline $handle $html
            close $handle
        } else {
            set out_filename [regsub "^$src_dir" $src_filename $out_dir]
            file copy -force $src_filename $out_filename
        }
    }
    foreach dir [glob -nocomplain -directory $src_dir -type d  *] {
        # Recurse for directories in src_dir
        make_docs $dir $template_dir [regsub "^$src_dir" $dir $out_dir] "[regsub "^$src_dir" $dir $url_root]/" $copyright_html
    }
}



# Args
qc::args $argv -local -- args
if { [llength $args] != 4 } {
    error "Error: Usage rebuild-docs.tcl ?-local? src_directory template_directory output_directory url_root"
}
set src_dir [string trim [lindex $args 0] /]
set template_dir [string trim [lindex $args 1] /]
set out_dir [string trim [lindex $args 2] /]
if { [info exists local] } {
    set url_root [qc::iif [regexp {^/} ${out_dir}] ${out_dir} [pwd]/${out_dir}]
} else { 
    set url_root [lindex $args 3]
}

# Copyright
set copyright_html "&copy; 2004-[qc::date_year now] Qcode Software Limited [qc::html_a www.qcode.co.uk http://qcode.co.uk]"

# Remove output directory if it already exists
exec rm -rf $out_dir
# build documentation from src_dir, converting markdown files to html files
make_docs $src_dir $template_dir $out_dir "/" $copyright_html

# Update Root Relative URLS according to url_root
# Check urls don't use . or .. syntax
set error_message ""
set exclude_url_patterns [list ^\.\.\.html$]
foreach html_filename [find_files $out_dir .html] { 
    # Read HTML files
    set html [read [set handle [open $html_filename]]]
    close $handle    
    
    # Update Root Relative URLS according to url_root
    regsub -nocase -all {([< ](?:href|src)\s*=\s*')/([^']*'[/ >])} $html \\1${url_root}/\\2 html
    regsub -nocase -all {([< ](?:href|src)\s*=\s*\")/([^\"]*\"[/ >])} $html \\1${url_root}/\\2 html
    regsub -nocase -all {([< ](?:href|src)\s*=\s*)/([^'\" ]*[/ >])} $html \\1${url_root}/\\2 html
    
    # Check urls don't use . or .. syntax
    set matches [regexp -nocase -all -inline {[< ](?:href|src)\s*=\s*'([^']+)'[/ >]} $html]
    lappend matches {*}[regexp -nocase -all -inline {[< ](?:href|src)\s*=\s*\"([^\"]+)\"[/ >]} $html]
    lappend matches {*}[regexp -nocase -all -inline {[< ](?:href|src)\s*=\s*([^'\" ]+)[/ >]} $html]
    foreach {. link} $matches {
        if { [regexp {(^\.)|(\./)} $link] && ![regexp -nocase [join $exclude_url_patterns |] $link] } {
            # Found url using . or .. syntax
            append error_message "${html_filename}: $link\n"
        }
    }

    # Write HTML files
    set handle [open $html_filename w 00644]
    puts $handle $html
    close $handle
}
if { $error_message ne "" } {
    error "\nError: Please modify the following relative urls so they don't use .. syntax.\nEg ../index.html -> /index.html\n\n$error_message" {} 1
}
